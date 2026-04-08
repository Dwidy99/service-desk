export function useAuthStatus() {
  const [loggedin, setLoggedin] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      setLoggedin(true)
    } else {
      setLoggedin(false)
    }
    setCheckingStatus(false)
  }, [user])

  return { loggedin, checkingStatus }
}
