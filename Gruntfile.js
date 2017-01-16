module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        config: {
            src: 'src',
            dist: 'dist'
        },

        assemble: {
            options: {
                engine: 'Handlebars',
                flatten: true,
                assets: '<%= config.dist %>/assets',
                data: '<%= config.src %>/data/*.{json,yml}',
                partials: '<%= config.src %>/templates/partials/*.hbs'
            },
            site: {
                src: ['<%= config.src %>/templates/index.hbs'],
                dest: '<%= config.dist %>/'
            },
        },

        less: {
            options: {
                paths: ['<%= config.src %>/assets/less/'],
                cleancss: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today(\'yyyy-mm-dd HH:MM\') %> */\n'
            },
            development: {
                files: { '<%= config.dist %>/css/all.css': '<%= config.src %>/assets/less/main.less' },
                options: {
                    sourceMap: true,
                    sourceMapFilename: '<%= config.dist %>/css/all.css.map',
                    sourceMapURL: 'all.css.map',
                    outputSourceFiles: true
                }
            }
        },

        watch: {
            options: {
                spawn: true,
                livereload: true,
                event: ['changed', 'added', 'deleted']
            },
            hbs: {
                files: [
                    '<%= config.src %>/**/*.hbs'
                ],
                tasks: ['precompile']
            },
            data: {
                files: [
                    '<%= config.src %>/data/*'
                ],
                tasks: ['precompile']
            },
            css: {
                files: [
                    '<%= config.src %>/assets/less/*.less',
                    '<%= config.src %>/assets/less/**/*.less',
                    '<%= config.src %>/assets/less/**/**/*.less'
                ],
                tasks: ['less']
            },
            javascript: {
                files: [
                    'app/data/*.json',
                    'app/data/**/*.json',
                    'app/data/**/**/*.json',

                    'app/components/*.js',
                    'app/components/**/*.js',
                    'app/components/**/**/*.js',
                ],
                tasks: ['jshint', 'test:unit:development']
            },
        },

        connect: {
            options: {
                hostname: '0.0.0.0',
                port: 8000,
                base: '<%= config.dist %>'
            },
            server: {
                options: {
                    livereload: true,
                }
            }
        },

        copy: {
            fonts: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/assets/fonts',
                    src: ['**/*', '*'],
                    dest: '<%= config.dist %>/fonts/'
                }]
            },
            docs: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/assets/docs',
                    src: ['**/*', '*'],
                    dest: '<%= config.dist %>/docs/'
                }]
            }
        },

        clean: {
            dist: {
                src: ['<%= config.dist %>']
            }
        },
    });

    grunt.loadNpmTasks('grunt-assemble');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', ['server']);
    grunt.registerTask('precompile', ['clean', 'copy', 'less', 'assemble']);
    grunt.registerTask('server', ['precompile', 'connect:server', 'watch']);
    grunt.registerTask('build', ['precompile', 'assemble']);

};