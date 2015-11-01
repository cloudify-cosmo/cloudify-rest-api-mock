'use strict';
module.exports = function(grunt) {

    var lintFiles = ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'];
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        jshint: {
            files: lintFiles,
            options: {
                jshintrc: 'src/.jshintrc'
            }
        },
        jscs: {
            files: lintFiles,
            options: {
                config: 'src/.jscsrc' // tweak for intellij's default
            }
        }
    });
    grunt.registerTask('default', ['jshint','jscs']);

};
