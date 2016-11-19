'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        dirs: {
            dest: '.',
            src: 'src',
            tmp: '.tmp'
        },

        // Copy files that don't need compilation to tmp/
        copy: {
            dist: {
                files: [{
                    dest: '<%= dirs.tmp %>/',
                    src: ['index.html', 'bootstrap.css', 'main.js'],
                    filter: 'isFile',
                    expand: true,
                    cwd: '<%= dirs.src %>'
                }]
            }
        },

        uncss: {
            options: {
                ignore: [
                    /\.has-error/
                ],
                htmlroot: '<%= dirs.tmp %>',
                stylesheets: ['/bootstrap.css']
            },
            dist: {
                src: '<%= dirs.tmp %>/*.html',
                dest: '<%= dirs.tmp %>/main.css'
            }
        },

        staticinline: {
            dist: {
                options: {
                    basepath: '<%= dirs.tmp %>/'
                },
                files: [{
                    expand: true,
                    cwd: '<%= dirs.tmp %>/',
                    src: '*.html',
                    dest: '<%= dirs.tmp %>/'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    conservativeCollapse: false,
                    decodeEntities: true,
                    minifyCSS: {
                        compatibility: 'ie9',
                        keepSpecialComments: 0
                    },
                    minifyJS: true,
                    minifyURLs: false,
                    processConditionalComments: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeOptionalAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    removeTagWhitespace: false,
                    sortAttributes: true,
                    sortClassName: true
                },
                expand: true,
                cwd: '<%= dirs.tmp %>',
                dest: '<%= dirs.dest %>',
                src: ['*.html']
            }
        },

        bootlint: {
            options: {
                relaxerror: ['W005']
            },
            files: ['<%= dirs.tmp %>/*.html']
        },

        htmllint: {
            src: '<%= dirs.dest %>/*.html'
        },

        connect: {
            options: {
                hostname: 'localhost',
                livereload: 35729,
                port: 8001
            },
            livereload: {
                options: {
                    base: '<%= dirs.dest %>/',
                    open: true  // Automatically open the webpage in the default browser
                }
            }
        },

        watch: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            build: {
                files: ['<%= dirs.src %>/*', 'Gruntfile.js'],
                tasks: 'build'
            }
        }

    });

    // Load any grunt plugins found in package.json.
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
    require('time-grunt')(grunt);

    grunt.registerTask('build', [
        'copy',
        'uncss',
        'staticinline',
        'htmlmin'
    ]);

    grunt.registerTask('test', [
        'build',
        'bootlint',
        'htmllint'
    ]);

    grunt.registerTask('default', [
        'build',
        'connect',
        'watch'
    ]);

};
