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
        }
        
    });
    
    grunt.loadNpmTasks('grunt-ts');
    
    grunt.registerTask('build',['ts']);
    
};