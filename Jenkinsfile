pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Start services (detached)') {
      steps {
        sh '''
          rm -rf artifacts || true
          mkdir -p artifacts
          docker-compose -f docker-compose.yml up -d --build
        '''
      }
    }

    stage('Wait for backend') {
      steps {
        sh '''
          chmod +x scripts/wait-for-url.sh
          ./scripts/wait-for-url.sh http://localhost:4000 30 2
        '''
      }
    }

    stage('Wait for frontend') {
      steps {
        sh '''
          ./scripts/wait-for-url.sh http://localhost:5173 30 2
        '''
      }
    }

    stage('Run tests in Docker') {
      steps {
        sh '''
          # Run tests inside the Playwright container defined in docker-compose.ci.yml
          docker-compose -f docker-compose.yml -f docker-compose.ci.yml up --abort-on-container-exit --exit-code-from tests --build
        '''
      }
    }
  }

  post {
    always {
      sh '''
        docker-compose -f docker-compose.yml -f docker-compose.ci.yml down --volumes --remove-orphans || true
        ls -la artifacts || true
      '''
      archiveArtifacts artifacts: 'artifacts/**', allowEmptyArchive: true
      junit allowEmptyResults: true, testResults: 'artifacts/**/test-results/**/*.xml'
    }
  }
}