node {

    def nodeHome = tool name: 'node-7.X', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${nodeHome}/bin:${env.PATH}"
    env.PATH = "${pwd()}/node_modules/.bin:${env.PATH}"
    git([url: 'https://github.com/ngKingFr/demo-gdc-web.git', branch: 'master'])
   credentials('git-gdc-demo')

    stage('checkout') {
        checkout scm
         sh 'git clean -fdx'
        sh 'npm --version'
        sh 'node --version'
    }

    stage('install'){
        sh 'npm install --verbose'
    }

    stage('build-release') {
        sh 'rm -rf dist'
        sh 'ngc -p tsconfig-build.json && cp src/app/my-lib/package.json dist/package.json && cp src/app/my-lib/.npmrc dist/.npmrc && gulp'
    }

    stage('publish') {
        sh 'cd /dist'
        sh 'npm publish'
    }
}