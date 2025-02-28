const processEnv = process.env.TEST_ENV;
const env = processEnv || 'dev';
console.log('Test environment is: ' + env);


const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'aydinserbest34@gmail.com',
    userPassword: 'Sa21342134'
}
if (env === 'qa') {
    config.userEmail = 'keryjohn70@gmail.com'
    config.userPassword = 'Sa21342134'
}
if (env === 'prod') {
    config.userEmail = ''
    config.userPassword = ''
}
export {config}