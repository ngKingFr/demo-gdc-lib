node {

    def nodeHome = tool name: 'node-7.X', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${nodeHome}/bin:${env.PATH}"
    env.PATH = "${pwd()}/node_modules/.bin:${env.PATH}"
    git([url: 'https://github.com/ngKingFr/demo-gdc-web.git', branch: 'master'])
   credentials('git-gdc-demo')

    stage('checkout') {
        checkout scm
         sh 'git clean -fdx -e node_modules'
        sh 'npm --version'
        sh 'node --version'
    }

    stage('install'){
        sh 'npm prune &&  npm update'
    }

    stage('build-release') {
        sh 'rm -rf dist'
        sh 'npm run build-release'
    }

    stage('publish') {
        dir('dist') {
             sh 'pwd'
             sh 'ls -la'
             sh 'npm publish --registry=http://172.17.0.3:8081/repository/npm-gdc-hosted/'
        }

    }
}