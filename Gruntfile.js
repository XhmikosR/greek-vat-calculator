'use strict';

var sass = require('sass');
var autoprefixer = require('autoprefixer');
var combineDuplicateSelectors = require('postcss-combine-duplicated-selectors');

module.exports = function(grunt) {
  // Load any grunt plugins found in package.json.
  require('load-grunt-tasks')(grunt);
  require('@lodder/time-grunt')(grunt);

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
      other: {
        files: [{
          dest: '<%= dirs.dest %>/',
          src: [
            '*',
            '!index.html'
          ],
          filter: 'isFile',
          dot: true,
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

    sass: {
      options: {
        implementation: sass,
        includePaths: ['./node_modules'],
        outputStyle: 'compressed',
        sourceMap: false
      },
      dist: {
        src: '<%= dirs.src %>/css/main.scss',
        dest: '<%= dirs.tmp %>/css/main.css'
      }
    },

    concat: {
      js: {
        src: [
          '<%= dirs.src %>/js/main.js'
        ],
        dest: '<%= dirs.tmp %>/js/main.js'
      }
    },

    postcss: {
      options: {
        processors: [
          combineDuplicateSelectors(),
          autoprefixer()
        ]
      },
      dist: {
        src: '<%= sass.dist.dest %>'
      }
    },

    purgecss: {
      dist: {
        options: {
          content: [
            '<%= dirs.tmp %>/**/*.html',
            '<%= dirs.tmp %>/js/**/*.js'
          ],
          keyframes: true,
          variables: false
        },
        files: {
          '<%= sass.dist.dest %>': ['<%= sass.dist.dest %>']
        }
      }
    },

    staticinline: {
      options: {
        basepath: '<%= dirs.tmp %>/'
      },
      prod: {
        files: [{
          expand: true,
          cwd: '<%= dirs.tmp %>/',
          src: '*.html',
          dest: '<%= dirs.tmp %>/'
        }]
      },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= dirs.tmp %>/',
          src: '*.html',
          dest: '<%= dirs.dest %>/'
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
              },
              2: {
                all: false,
                mergeMedia: true,
                removeDuplicateMediaBlocks: true,
                removeEmpty: true
              }
            }
          },
          minifyJS: true,
          minifyURLs: false,
          processConditionalComments: true,
          removeAttributeQuotes: true,
          removeComments: true,
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
      dist: {
        src: [
          'Gruntfile.js',
          '<%= dirs.src %>/js/*.js'
        ]
      }
    },

    htmllint: {
      options: {
        ignore: /The “inputmode” attribute is not supported in all browsers./
      },
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
      dev: {
        files: ['<%= dirs.src %>/**', 'Gruntfile.js'],
        tasks: 'build:dev'
      },
      build: {
        files: ['<%= dirs.src %>/**', 'Gruntfile.js'],
        tasks: 'build'
      }
    },

    clean: {
      dist: [
        '<%= dirs.tmp %>/',
        '<%= dirs.dest %>/'
      ]
    }
  });

  grunt.registerTask('build:dev', [
    'clean',
    'copy',
    'concat',
    'sass',
    'postcss',
    'staticinline:dev'
  ]);

  grunt.registerTask('build', [
    'clean',
    'copy',
    'concat',
    'sass',
    'postcss',
    'purgecss',
    'staticinline:prod',
    'htmlmin'
  ]);

  grunt.registerTask('test', [
    'build',
    'eslint',
    'htmllint'
  ]);

  grunt.registerTask('default', [
    'build:dev',
    'connect',
    'watch:dev'
  ]);

  grunt.registerTask('server', [
    'build',
    'connect',
    'watch:build'
  ]);
};
