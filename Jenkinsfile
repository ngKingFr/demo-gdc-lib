node {

    def nodeHome = tool name: 'node-7.X', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${nodeHome}/bin:${env.PATH}"
    env.PATH = "${pwd()}/node_modules/.bin:${env.PATH}"
    git([url: 'https://github.com/ngKingFr/demo-gdc-web.git', branch: 'master'])
   credentials('git-gdc-demo')

    stage('checkout') {
        sh 'npm --version'
        sh 'node --version'
    }

    stage('install'){
        sh 'npm install'
    }

    stage('build-release') {

        sh 'npm run build-release'
    }

    stage('publish') {
        sh 'cd dist'
        sh 'npm publish'
    }
}