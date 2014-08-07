# require 'phantomjs'
# require 'rubygems'

SLEEPTIME = 45
USER = 'Sarah' #[(print 'Username: '), gets.rstrip][1]
PASS = 'NotRequired' #[(print 'Password: '), gets.rstrip][1]
PHANTOMJSPATH = "c:\\Development\\phantomjs-1.9.7\\phantomjs.exe"
PHANTOMSCRIPT = ".\\disney_phantom.js"
puts "Hello " + USER

$errors = 0
$iteration = 1

begin
	@iterationTime = Time.new.strftime("%Y-%m-%d %H:%M:%S")
	@status = "None"
	print "#$iteration) #{@iterationTime} -- Executing - "
	
    # run phantomjs
	#Phantomjs.run('./disney_phantom.js') { |line| puts @line }
	#Phantomjs.run('./disney_phantom.js')
    @status = %x[#{PHANTOMJSPATH} #{PHANTOMSCRIPT}]
	
    if @status.include? 'ERROR'
        $errors += 1
        puts "#{@status} (Errors: #{$errors})"
        print "\a"
        sleep 60
    else
        puts "#{@status}"
        unless @status.include? 'NO_AVAILABILITY' or @status.include? 'NULL_AVAILABILITY'
            begin
                print "\a"
                sleep 1
            end while 1
        end    
    end 
        
	$iteration += 1
	sleep SLEEPTIME
end while 1





# Phantomjs.run('') # => returns stdout

# take a block to receive each line of output
# Phantomjs.run('./disney_phantom.js') { |line| puts @line }