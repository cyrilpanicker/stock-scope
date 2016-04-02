var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(grunt){
    
    grunt.initConfig({
        
        ts:{
            options:{
                module:'commonjs',
                target:'es5',
                sourceMap:false,
                fast:'never'
            },
            default:{
                files:[
                    {
                        src:['source/**/*.ts*'],
                        dest:'build'
                    }
                ]
            }
        },
        
        sass:{
            default:{
                options:{
                    sourcemap:'none',
                    style:'expanded'
                },
                files:{
                    'build/client/styles.css':'source/client/styles.scss'
                }
            }
        },
        
        webpack:{
            default:{
                entry:'./build/client/main.js',
                output:{
                    filename:'bundle.js',
                    path:'./build/client/public'
                },
                plugins:[
                    new HtmlWebpackPlugin({
                        title:'Stock Scope',
                        filename:'index.html'
                    })
                ],
                devtool:'inline-source-map',
                module:{
                    loaders:[
                        {
                            // test: /\.json$/, loader: 'json-loader',
                            test: /\.css$/, loader: 'style-loader!css-loader'
                        }
                    ]
                }
                // node:{
                //     console:'empty',
                //     fs:'empty',
                //     net:'empty',
                //     tls:'empty'
                // }
            }
        },
        
        shell:{
            run:{
                command:'node ./build/server/main.js'
            }
        }
        
    });
    
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-sass');
    
    grunt.registerTask('build',['ts','sass']);
    grunt.registerTask('bundle',['webpack']);
    grunt.registerTask('run',['shell:run']);
    grunt.registerTask('default',['build','bundle','run']);
    
};