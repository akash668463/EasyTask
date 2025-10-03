pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    stages {
        stage('Test Node') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }
    }
}
