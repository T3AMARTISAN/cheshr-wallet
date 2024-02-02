const LogoutButton = ({ setTabNumber, tabNumber }) => {
  const onClickLogout = () => {
    setTabNumber(0);
  };

  return <button onClick={onClickLogout}>Logout</button>;
};

export default LogoutButton;
