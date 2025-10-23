pipeline {
  agent any

  environment {
    NODE_VERSION = '18'
    // If you use different environment, set ENVIRONMENT=stage or similar
    ENVIRONMENT = 'dev'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Start services (docker-compose)') {
      steps {
        sh '''
          # Start backend and frontend as defined in docker-compose.yml
          docker-compose up -d --build
          # Give apps a moment to boot
          sleep 10
        '''
      }
    }

    stage('Install dependencies') {
      steps {
        // Install server deps (if you want to run tests outside container)
        dir('server') {
          sh 'npm ci'
        }
        // Install client deps (used by frontend container and local build)
        dir('client') {
          sh 'npm ci'
        }
        // Install test deps
        dir('tests') {
          sh 'npm ci'
        }
      }
    }

    stage('Install Playwright browsers') {
      steps {
        dir('tests') {
          // installs browser binaries and native dependencies when possible
          sh 'npx playwright install --with-deps'
        }
      }
    }

    stage('Run API tests') {
      steps {
        dir('tests') {
          // Option A: use package.json scripts
          sh 'npx playwright test --grep "@api" --workers=1 --reporter=list'
        }
      }
      post {
        always {
          archiveArtifacts artifacts: 'tests/allure-results/**', allowEmptyArchive: true
        }
      }
    }

    stage('Run UI tests') {
      steps {
        dir('tests') {
          sh 'npx playwright test --grep "@ui" --workers=1 --reporter=list'
        }
      }
      post {
        always {
          archiveArtifacts artifacts: 'tests/allure-results/**', allowEmptyArchive: true
        }
      }
    }
  }

  post {
    always {
      // Tear down containers
      sh 'docker-compose down --volumes'
      // Optionally collect Playwright html report
      archiveArtifacts artifacts: 'tests/playwright-report/**', allowEmptyArchive: true
      junit allowEmptyResults: true, testResults: 'tests/test-results/**/*.xml'
    }
    failure {
      echo 'Build failed — check logs and artifacts.'
    }
  }
}