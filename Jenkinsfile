pipeline {
    agent any
    tools {
        nodejs 'NodeJS' // Name as configured in Jenkins global tools
    }
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/akash668463/EasyTask.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Build Angular App') {
            steps {
                bat 'npm run build -- --configuration production'
            }
        }
        stage('Build Docker Image (Local)') {
            steps {
                bat 'docker build -t easytask-local:%BUILD_NUMBER% .'
                bat 'docker tag easytask-local:%BUILD_NUMBER% easytask-local:latest'
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
