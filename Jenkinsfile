pipeline {
    agent any
    tools {
        nodejs 'NodeJS' // Name as configured in Jenkins global tools
    }
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/akash668463/Angular-Project.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
    }
}