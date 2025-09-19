const URL: string = window.location.href.includes('localhost')
  ? 'http://localhost:4444/api'
  : 'https://familytree-7old.onrender.com/api';

export { URL };