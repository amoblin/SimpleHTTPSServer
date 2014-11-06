# -*- coding: utf-8 -*-

############################################################################
# 修改下面内容
#
$projDir = "/Users/amoblin/Marboo/Projects/MyProjects/iOS/MusicFeeling"
$name = "MusicFeeling"
$scheme = "k2k"
$title = "傻瓜演奏家"
$baseURL = "https://tf.marboo.biz"
#
# 修改结束
############################################################################



$ipaFile = "#{$projDir}/#{$scheme}.ipa"
$templatePlistFile = "template.plist"
$plistFile = "#{$projDir}/#{$name}.plist"

class Generator
  def plistFile
    "%s/%s.plist" % [@baseDir, self.fileName]
  end
  def ipaFileDir
    @baseDir
  end
  def distIpaFile
    "%s/%s.ipa" % [self.ipaFileDir, self.fileName]
  end
  def ipaURL
    "%s/%s.ipa" % [@baseURL, self.fileName]
  end

  def fileName
    "%s_%s_r%s" % [self.name, `date +%F`.rstrip, self.revision]
  end
  def revision
    `defaults read #{@infoFile} CFBundleVersion`.rstrip
  end

  attr_accessor :name, :title
  attr_accessor :baseURL, :baseDir, :profile, :scheme, :signature, :infoFile, :bundleId

  def initialize(name, title)
    @name = name
    @title = title
  end
  def setBase(baseURL, baseDir, profile, scheme, signature)
    @profile = profile
    @baseURL = baseURL
    @baseDir = baseDir
    @scheme = scheme
    @signature = signature

    @infoFile = "#{$projDir}/#{@name}/#{@name}-Info"
    @bundleId = `defaults read #{@infoFile} CFBundleIdentifier`.rstrip

  end
  def build
    cmd = "cd #{$projDir};xcodebuild -workspace #{$name}.xcworkspace -scheme #{@scheme} -configuration Release -sdk iphoneos8.1 -derivedDataPath . clean"
    %x(#{cmd})
    cmd = "cd #{$projDir};xcodebuild -workspace #{$name}.xcworkspace -scheme #{@scheme} -configuration Release -sdk iphoneos8.1 -derivedDataPath . CODE_SIGN_IDENTITY=\"#{@signature}\""
    puts `#{cmd}`
  end
  def generateIpa
    @appPath = "#{$projDir}/Build/Products/Release-iphoneos/#{@scheme}.app"
    cmd = "cd #{$projDir};xcrun -sdk iphoneos PackageApplication -v #{@appPath} -o #{$ipaFile} -sign \"#{@signature}\" -embed #{@profile}"
    puts `#{cmd}`
    #`cp #{$ipaFile} ~/Downloads`
  end
  def distribute(type)
#    Dir.exits #{self.distIpaFile}  Dir.mkdir(
    `cp #{$ipaFile} #{self.distIpaFile}`
    #################
    #
    # Provisioning Profile: None
    # Code Signing:         Don't Code Sign
    # !!!!!! first make sure code sing building setting for Release in Xcode is none
    #
    #################

    `cp -f #{$templatePlistFile} #{self.plistFile}`
    `sed -i .bak "s#\\#URL##{self.ipaURL}#" #{self.plistFile}`
    `sed -i .bak "s#\\#bundleId##{@bundleId}#" #{self.plistFile}`
    `sed -i .bak "s#\\#bundleVersion##{self.revision}#" #{self.plistFile}`
    `sed -i .bak "s#\\#title##{self.revision}#" #{self.plistFile}`
    `rm -f #{self.plistFile}.bak`
  end
  def generateHtml()
    require 'json'
    plists = Dir.entries(File.expand_path(self.baseDir)).select{|x| File.extname(x) == ".plist"}.map{|x| "%s" % File.basename(x, ".plist")}.reverse
    params = {:urlRoot => "#{@baseURL}", :plists => plists, :title => "#{@title}", :version => true}
    `jade --pretty --obj '#{params.to_json}' views/index.jade -o #{self.baseDir}`
  end
  def push()
    `cd #{@baseDir};git add -A;git commit -m "r#{self.revision} released"`
  end

end

generator = Generator.new $name, $title

task :default do |t|
  puts `defaults read #{$infoFile} CFBundleShortVersionString`
  puts $bundleId
  puts $revision
  puts `git log --pretty=oneline|wc -l`
end

task :dist do
  # Local URL
  @baseDir = "%s/public/" % Dir.pwd
  profile = "#{$projDir}/dev.mobileprovision"
  #signature = "iPhone Developer: CUI GUILIN (2L2Z2R7J6H)"
  signature = "iPhone Developer: Cui Guilin (CF3AN73YM2)"
  generator.setBase($baseURL, @baseDir, profile, $scheme, signature)

  generator.build()
  generator.generateIpa()
  generator.distribute("local")

  generator.generateHtml()
  #`rm -f #{@baseDir}index.html`
#  generator.push()
end

task :inHouse do
  @baseDir = "%s/public/" % Dir.pwd
  profile = "#{$projDir}/inHouse.mobileprovision"
  signature = "iPhone Distribution: MofunSky Technology (Beijing) Co., Ltd"
  @scheme = "mofunshowInHouse"
  generator.setBase($baseURL, @baseDir, profile, @scheme, signature)

  generator.build()
  generator.generateIpa()
  generator.distribute("local")
  generator.generateHtml()
  generator.push()
end

task :notify do |t|
  `say -v Moira Pay attention, guys. new app revision #{$revision} is released. Please upgrade.`
end

task :archive do |t|
  `xcodebuild -exportArchive -exportPath Release/mofunshow -archivePath /Users/amoblin/Library/Developer/Xcode/Archives/2013-12-21/mofunshow\ 13-12-21\ 6.47.xcarchive`
end

task :dmg => :xcode do |t|
  tag = `git describe --tag`
  filename = "#{name}_%s.dmg" % tag.rstrip
  sh "ln -sf /Applications /tmp/#{name}"
  sh "rm -rf ~/Downloads/%s" % filename
  sh "hdiutil create ~/Downloads/%s -srcfolder /tmp/#{name}" % filename
  sh "cp ~/Downloads/%s /tmp" % filename
end

