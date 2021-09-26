const AdminHome = (): JSX.Element => {
  return (
    <div className="px-48 mt-8">
      <div className="container border border-solid border-white rounded-lg text-center mx-auto px-8 py-6 max-w-sm">
        <div className="mb-5">
          <h1 className="font-bold text-lg">Log In</h1>
        </div>
        <form id="login">
          <input
            id="usernameInput"
            type="text"
            name="username"
            placeholder="Username"
            required
            className="rounded text-black text-center mb-3 w-full"
          />
          <input
            id="passwordInput"
            type="password"
            name="password"
            placeholder="Password"
            required
            className="rounded text-black text-center mb-3 w-full"
          />
          <div className="mb-3">
            <div>
              <label htmlFor="rememberToggle" className="checkbox text-left">
                <input
                  id="rememberToggle"
                  type="checkbox"
                  name="remember"
                  className="cursor-pointer rounded"
                />
                Remember me
              </label>
            </div>
          </div>
          <input
            id="submitButton"
            type="submit"
            value="Log In"
            className="btn rounded text-black text-center m-0 w-full"
          />
        </form>
      </div>
    </div>
  );
};

export default AdminHome;
