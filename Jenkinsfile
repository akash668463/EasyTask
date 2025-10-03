pipeline {
  agent any

  tools {
    // make sure a NodeJS installation named 'NodeJS' is configured in Jenkins Global Tools
    nodejs 'NodeJS'
  }

  environment {
    APP_NAME = "essentials"
    DOCKER_IMAGE = "essentials-local"
  }

  options {
    // keep one build at a time for simplicity; add timestamps to logs
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
        // uses NodeJS tool provided by Jenkins
        sh 'npm ci'
      }
    }

    stage('Quality Checks (parallel)') {
      parallel {
        stage('Unit Tests') {
          steps {
            // run Karma tests in headless mode (ensure Chrome/ChromeHeadless available on agent)
            sh 'npm test -- --watch=false --browsers=ChromeHeadless || { echo "Tests failed"; exit 1; }'
          }
        }

        stage('Lint (if configured)') {
          steps {
            // If you add lint script ("lint": "ng lint") this will run it. If not present, it will be skipped gracefully.
            script {
              def hasLint = fileExists('package.json') && sh(script: "node -e \"console.log(require('./package.json').scripts && require('./package.json').scripts.lint ? 'yes' : 'no')\"", returnStdout: true).trim()
              if (hasLint == 'yes') {
                sh 'npm run lint'
              } else {
                echo "No lint script configured, skipping lint."
              }
            }
          }
        }
      }
    }

    stage('Build (production)') {
      steps {
        sh 'npm run build -- --configuration production'
        // confirm dist exists
        sh 'ls -la dist || true'
      }
    }

    stage('Docker Build (local)') {
      steps {
        // Build Docker image locally on Jenkins node (no push)
        sh "docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
        sh "docker tag ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
      }
    }

    stage('Deploy to local test (optional)') {
      steps {
        // This will run container on Jenkins host for quick smoke test.
        // Ensure Jenkins user can run docker and expose port 8080.
        sh '''
          docker rm -f ${APP_NAME}-test || true
          docker run -d --name ${APP_NAME}-test -p 8080:80 ${DOCKER_IMAGE}:latest
        '''
        echo "Application should be available on Jenkins host: http://<jenkins-host-or-ip>:8080"
      }
    }
  }

  post {
    always {
      // show built images (helpful)
      sh 'docker images | head -n 20 || true'
      cleanWs()
    }
    success {
      echo "Pipeline finished successfully."
    }
    failure {
      echo "Pipeline failed — inspect console output."
    }
  }
}
