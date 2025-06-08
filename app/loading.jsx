//app\loading.jsx
const { default: Loader } = require("./_components/Loader")

const loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader />
    </div>
  )
}

export default loading