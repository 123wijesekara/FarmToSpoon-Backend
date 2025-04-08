const verifyEmailTemplate =({name,url})=>{
    return`
    <p>Dear ${name}</p>
    <p>
       Thank you For registering Farm To Spoon. 
    </p>
    <a href=${url} style="color:white;background:blue;margin-top :10px">
    Verify Email
    </a>
    `
}

export default verifyEmailTemplate