export default function Modal({ title, message, handleCloseModal }) {
  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        onClick={() => handleCloseModal()}
      >
        <div className="relative w-auto my-6 mx-auto max-w-sm">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/*header*/}
            <div className="flex items-start justify-between py-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => handleCloseModal()}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-blueGray-500 text-md leading-relaxed">
                {message}
              </p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="bg-red-700 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="button"
                onClick={() => handleCloseModal()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
