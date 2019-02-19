'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        dirs: {
            dest: '_site',
            src: 'src',
            tmp: '.tmp'
        },

        // Copy files that don't need compilation to _site/
        copy: {
            index: {
                files: [{
                    dest: '<%= dirs.tmp %>/',
                    src: [
                        'index.html'
                    ],
                    filter: 'isFile',
                    expand: true,
                    cwd: '<%= dirs.src %>/'
                }]
            },
            serviceWorker: {
                src: '<%= dirs.src %>/js/service-worker.js',
                dest: '<%= dirs.dest %>/service-worker.js'
            },
            other: {
                files: [{
                    dest: '<%= dirs.dest %>/',
                    src: [
                        '*.*',
                        '!index.html'
                    ],
                    filter: 'isFile',
                    expand: true,
                    cwd: '<%= dirs.src %>/'
                }]
            },
            img: {
                files: [{
                    dest: '<%= dirs.dest %>/',
                    src: 'img/**',
                    expand: true,
                    cwd: '<%= dirs.src %>/'
                }]
            }
        },

        concat: {
            css: {
                src: [
                    '<%= dirs.src %>/css/bootstrap.css',
                    '<%= dirs.src %>/css/main.css'
                ],
                dest: '<%= dirs.tmp %>/css/main.css'
            },
            js: {
                src: [
                    '<%= dirs.src %>/js/main.js',
                    '<%= dirs.src %>/js/pwa.js',
                    '<%= dirs.src %>/js/google-analytics.js'
                ],
                dest: '<%= dirs.tmp %>/js/main.js'
            }
        },

        postcss: {
            options: {
                processors: [
                    require('postcss-combine-duplicated-selectors')(),
                    require('css-mqpacker')(),  // combine media queries
                    require('autoprefixer')()   // add vendor prefixes
                ]
            },
            dist: {
                src: '<%= concat.css.dest %>'
            }
        },

        purgecss: {
            dist: {
                options: {
                    content: [
                        '<%= dirs.tmp %>/**/*.html',
                        '<%= dirs.tmp %>/js/**/*.js'
                    ]
                },
                files: {
                    '<%= concat.css.dest %>': ['<%= concat.css.dest %>']
                }
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
                        level: {
                            1: {
                                specialComments: 0
                            }
                        }
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
                src: [
                    '*.html',
                    '!404.html'
                ]
            }
        },

        eslint: {
            options: {
                config: '.eslintrc.json'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: {
                src: [
                    '<%= dirs.src %>/js/*.js'
                ]
            }
        },

        bootlint: {
            options: {
                relaxerror: ['W005']
            },
            files: [
                '<%= dirs.tmp %>/*.html',
                '!<%= dirs.tmp %>/404.html'
            ]
        },

        htmllint: {
            src: [
                '<%= dirs.dest %>/*.html',
                '!<%= dirs.dest %>/google*.html'
            ]
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
                files: ['<%= dirs.src %>/**', 'Gruntfile.js'],
                tasks: 'build'
            }
        },

        clean: {
            tests: [
                '<%= dirs.tmp %>/',
                '<%= dirs.dest %>/'
            ]
        },

        'gh-pages': {
            options: {
                base: '<%= dirs.dest %>'
            },
            src: ['**']
        }

    });

    // Load any grunt plugins found in package.json.
    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });
    require('time-grunt')(grunt);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'concat',
        'postcss',
        'purgecss',
        'staticinline',
        'htmlmin'
    ]);

    grunt.registerTask('test', [
        'build',
        'eslint',
        'build',
        'bootlint',
        'htmllint'
    ]);


    grunt.registerTask('deploy', [
        'build',
        'gh-pages'
    ]);

    grunt.registerTask('default', [
        'build',
        'connect',
        'watch'
    ]);

};
