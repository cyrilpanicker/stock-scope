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
                ]
            }
        },
        
        shell:{
            run:{
                command:'node ./build/app.js'
            }
        }
        
    });
    
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-webpack');
    
    grunt.registerTask('build',['ts']);
    grunt.registerTask('bundle',['webpack']);
    grunt.registerTask('run',['shell:run']);
    grunt.registerTask('default',['build','bundle','run']);
    
};