import { useNavigate } from "react-router";

interface SecretPageProps {
  user: { email: string };
  logout: () => void;
}

const SecretPage: React.FC<SecretPageProps> = (props) => {
  const navigate = useNavigate();
  return (
    <div className="secret_page">
    <h1>This is the secret page for {props.user.email}</h1> 
    <h2>You can access here only after verify the token</h2>
    <button
    onClick={() => {
      props.logout();
      navigate("/");
    }}
    >
    logout
    </button>
    </div>
    );
};

export default SecretPage;