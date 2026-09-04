import LoginPage from "../components/login/LoginPage";

const Login = () => {
  return (
    <div className="w-full flex justify-center relative min-h-screen py-8 px-2 sm:px-4">
      <div className="absolute top-0 left-0 w-full h-[320px] sm:h-80 z-0 bg-[radial-gradient(circle_at_top,theme(colors.pink.900),theme(colors.pink.950),theme(colors.purple.950))]" />
      <div className="absolute top-[320px] sm:top-80 left-0 w-full overflow-y-hidden bottom-0 z-0 bg-gradient-to-b from-purple-950/90 to-purple-950" />
      <div className="relative z-10 w-full mt-8 sm:mt-12">
        <LoginPage />
      </div>
    </div>
  );
};

export default Login;
