pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        APP_NAME = "essentials"
    }

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build (optional)') {
            steps {
                // You can comment this out if you don't want to build yet
                sh 'npm run build -- --configuration development || echo "Build skipped or failed"'
            }
        }

        stage('Verify Node & NPM') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "✅ Minimal pipeline finished successfully."
        }
        failure {
            echo "⚠ Pipeline finished with errors. Check logs for details."
        }
    }
}
