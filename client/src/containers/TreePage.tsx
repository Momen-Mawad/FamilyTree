import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Tree from "react-d3-tree";
import { URL } from "../config.js";
import axios from "axios";

interface TreePageProps {
  user: { email: string };
  logout: () => void;
}

const TreePage: React.FC<TreePageProps> = (props) => {
  const navigate = useNavigate();
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamilyTree = async () => {
      try {
        // Fetch data from the new, transformed endpoint
        const familyId = "68ca981a5bbf0f21fb7322e5"; // Replace with a dynamic ID
        const response = await axios.get(`${URL}/families/${familyId}`);

        if (!response.data) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.data;
        // The data is now ready to use directly
        setTreeData(data.members);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyTree();
  }, []);


  if (loading) {
    return <div>Loading family tree...</div>;
  }


  return (
    <div className="tree_page">
      <h1>Family Tree for {props.user.email}'s Family</h1>
      <h2>You can access here only after verify the token</h2>

      <div style={{ width: '100%', height: '500px' }}>
        {treeData ? (
          <Tree
            data={treeData}
            orientation="vertical"
            translate={{ x: 300, y: 50 }}
          />
        ) : (
          <p>No family tree data found.</p>
        )}
      </div>

      <button
        onClick={() => {
          props.logout();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default TreePage;