export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0711] w-full ">
      <div className="flex w-full max-w-[1000px] h-[600px] border rounded-md border-slate-800 p-4">
        <div className="flex flex-col flex-1 gap-2 items-center justify-center bg-[radial-gradient(ellipse_150%_100%_at_50%_100%,#000000_40%,transparent_80%),linear-gradient(to_bottom,#d8b4fe_0%,#6b21a8_45%,#000000_100%)] w-[55%] h-full">
          <div className="flex flex-col items-center justify-center w-1/2">
            <h2 className="text-2xl text-slate-50 font-semibold">Loveable</h2>
            <h1 className="text-2xl text-slate-50 mt-3">Get started with us</h1>
            <span className="text-slate-400 font-light text-center mt-1">
              Complete these easy steps to register your account
            </span>

            <div className="mt-8 w-full flex flex-col mx-auto max-w-md gap-1">
              <div className="flex flex-row border rounded-md border-gray-400 h-1/2 px-4 py-2 items-center bg-slate-100 gap-2">
                <span className="flex borded rounded-full w-4 h-4 bg-slate-950 text-slate-50 items-center justify-center text-xs">1</span>
                <span>sign up your account</span>
              </div>

              <div className="flex flex-row border rounded-md border-gray-400 h-1/ px-4 py-2 items-center  bg-slate-100 gap-2">
                <span className="flex borded rounded-full w-4 h-4 bg-slate-950 text-slate-50 items-center justify-center text-xs">1</span>
                <span>set up your workspace</span>
              </div>

              <div className="flex flex-row border rounded-md border-gray-400 h-1/2 px-4 py-2 items-center  bg-slate-100 gap-2">
                <span className="flex borded rounded-full w-4 h-4 bg-slate-950 text-slate-50 items-center justify-center text-xs">1</span>
                <span>setup your profile</span>
              </div>
            </div>
          </div>
        </div>

        

        <div className="flex flex-col items-center justify-center  flex-1 ">

          <span className="text-2xl font-semibold text-slate-50 ">Sign up Account</span>
          <span className="text-slate-200">Enter your personal data to create your account</span>

          <div className=" flex flex-row gap-4 mt-9">
            <button className="border border-gray-50 flex-1 flex bg-slate-100" >Google</button>
            <button className=" border border-gray-50 flex flex-1 bg-slate-100">Github</button>
          </div>

          <div>------------or--------------</div>

          <div>
            <span>Name</span>
            <input type="text" />
          </div>

          <div>
            <span>Email</span>
            <input type="text" />
          </div>

          <div>
            <span>Password</span>
            <input type="text" />
            
            
          </div>

          


          
        </div>
      </div>
    </div>
  );
}
