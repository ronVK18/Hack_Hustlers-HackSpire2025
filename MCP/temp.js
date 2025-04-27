import axios from "axios";
const fetchData = async () => {
    const response = await axios.get("http://localhost:3000/user/get_user", {
      name: "dhav",
    });
    if (response.data.sucess == false) 
      return null
    console.log(response.data)
    return response.data.message;
    
  };
 const id = await fetchData();
 console.log(id)