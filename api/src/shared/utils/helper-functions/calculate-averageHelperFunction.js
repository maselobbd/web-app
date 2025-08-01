const averageCalculation = async (base64String) => {
    try {
      const url = process.env.DS_TOOL_API;
      let dataResponse;
      let data
  
      if (base64String) {
        const fileBase64String = base64String.replace(/^.+,/, "");
        dataResponse = await fetch(
          url,
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              file: fileBase64String
            }),
          }
        )
  
        data = await dataResponse.json();
      }
      
      return data
  
    } catch (error) {
      return error
    }
  }

  module.exports = {
    averageCalculation,
  }