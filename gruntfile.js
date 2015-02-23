'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'app/', src: ['**'], dest: 'public/', filter: 'isFile'}
        ]
      }
    }
  });

  grunt.registerTask('default', ['uglify']);
};