module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        config: {
            src: 'src',
            dist: 'dist',
            applicationFiles: grunt.file.readJSON('./scripts.json').application,
            vendorFiles: grunt.file.readJSON('./scripts.json').vendor
        },

        assemble: {
            options: {
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
                    '<%= config.src %>/assets/js/*.js',
                    '<%= config.src %>/assets/js/**/*.js',
                    '<%= config.src %>/assets/js/**/**/*.js',
                ],
                tasks: ['minify']
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
            },
            img: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/assets/img',
                    src: ['**/*', '*'],
                    dest: '<%= config.dist %>/img/'
                }]
            }
        },

        clean: {
            dist: {
                src: ['<%= config.dist %>']
            }
        },

        uglify: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true,
                enclose: { window: 'window' },
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today(\'yyyy-mm-dd\') %> */\n'
            },
            production: {
                files: {
                    '<%= config.dist %>/js/app.min.js': ['<%= config.dist %>/js/app.js']
                }
            }
        },

        concat: {
            options: {
                sourceMap: true,
                separator: ';',
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today(\'yyyy-mm-dd HH:MM\') %> */\n'
            },
            production: {
                src: [
                    '<%= config.vendorFiles %>',
                    '<%= config.applicationFiles %>'
                ],
                dest: '<%= config.dist %>/js/app.js'
            }
        },

        //try to get the aws keys from keys file for local deployment
        //otherwise use env vars for CI/CD pipeline
        aws: function() {
            try {
                return grunt.file.readJSON('aws-keys.json')
            } catch (e) {
                return {
                    'AWSAccessKeyId': process.env.AWS_S3_ACCESS_KEY,
                    'AWSSecretKey': process.env.AWS_S3_SECRET_KEY
                }
            }
        } (),

        aws_s3: {
            options: {
                accessKeyId: '<%= aws.AWSAccessKeyId %>', // Use the variables
                secretAccessKey: '<%= aws.AWSSecretKey %>', // You can also use env variables
                region: 'eu-west-1',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5, // 5 simultaneous downloads
                bucket: 'andrewpwarren'
            },
            prod: {
                files: [
                    { expand: true, cwd: '<%= config.dist %>/', src: ['**'], dest: '/' }
                ]
            }
        },
    });

    grunt.loadNpmTasks('grunt-assemble');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-aws-s3');

    // Default task(s).
    grunt.registerTask('default', ['server']);

    grunt.registerTask('minify', [
        'concat',
        'uglify',
    ]);

    grunt.registerTask('precompile', [
        'clean',
        'copy',
        'less',
        'minify',
        'assemble'
    ]);
    grunt.registerTask('server', ['precompile', 'connect:server', 'watch']);
    grunt.registerTask('build', ['precompile']);
    grunt.registerTask('deploy', ['build', 'aws_s3'])

};