'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: {
      temp: ['.tmp'],
      dist: ['public']
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'app/', src: ['**', '!**/*.jade', '!**/*.{sass,scss}', '!scripts/*.js'], dest: 'public/', filter: 'isFile'}
        ]
      }
    },
    connect: {
      options: {
        port: 8888,
        open: true,
        useAvailablePort: true,
        hostname: 'localhost'
      },
      server: {
        options: {
          livereload: true,
          middleware: function(connect) {
            return [
              connect.static('public'),
              connect().use('/scripts', connect.static('./app/scripts')),
              connect().use('/bower_components', connect.static('./bower_components'))
            ];
          }
        }
      }
    },
    concat: {
      iife: {
        options: {
          banner: ';(function() {',
          footer: '}());'
        },
        src: ['public/js/main.min.js'],
        dest: 'public/js/main.min.js'
      }
    },
    usemin: {
      html: ['public/**/*.html']
    },
    useminPrepare: {
      html: ['public/index.html'],
      options: {
        dest: 'public',
        root: 'app'
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: [{expand: true, cwd: 'app/', src: ['**/*.jade', '!**/_*.jade'], dest: 'public/', ext: '.html'}]
      }
    },
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'public/css/main.css': 'app/styles/main.scss'
            }
        }
    },
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          'public/**/*.html',
          'public/css/**/*.css',
          'public/js/**/*.js',
          'app/scripts/**/*.js'
        ]
      },
      other: {
        files: [ 'app/**', '!app/**/*.jade', '!app/**/*.{sass,scss}'],
        tasks: ['copy']
      },
      jade: {
        files: ['app/**/*.jade'],
        tasks: ['jade']
      },
      sass: {
        files: ['app/**/*.{sass,scss}'],
        tasks: ['sass']
      }
    },
    wiredep: {
      build: {
        src: ['public/**/*.html']
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8']
      },
      post_process: {
        src: 'public/css/main.css'
      }
    }
  });
  grunt.registerTask('default', []);
  grunt.registerTask('build', ['clean', 'copy', 'jade', 'sass', 'autoprefixer', 'wiredep', 'combineJS']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);
  grunt.registerTask('combineJS', [
    'clean:temp',
    'wiredep',
    'useminPrepare',
    'concat:generated',
    'uglify:generated',
    'usemin',
    'concat:iife',
    'clean:temp'
  ]);
};
