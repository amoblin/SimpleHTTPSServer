# -*- coding: utf-8 -*-

$projDir = "/Users/amoblin/proj/amoblin/MofunSky/mofunshow"
$name="mofunshow"
$title = "英语魔方秀"
$ipaFile = "#{$projDir}/#{$name}.ipa"

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

  def httpBaseDir
    "%s/http" % @baseDir
  end
  def httpPlistFile
    "%s/%s.plist" % [self.httpBaseDir, self.fileName];
  end
  def httpPlistURL
    "%s/http/%s.plist" % [@baseURL, self.fileName];
  end
  def httpIpaURL
    "%s/%s.ipa" % [@baseURL, self.fileName];
  end
  def fileName
    "%s_r%s" % [`date +%F`.rstrip, self.revision]
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

    @infoFile = "#{$projDir}/#{@scheme}/#{@scheme}-Info"
    @bundleId = `defaults read #{@infoFile} CFBundleIdentifier`.rstrip

  end
  def build
    cmd = "cd #{$projDir};xcodebuild -workspace #{$name}.xcworkspace -scheme #{@scheme} -configuration Release -sdk iphoneos7.1 -derivedDataPath . clean"
    %x(#{cmd})
    cmd = "cd #{$projDir};xcodebuild -workspace #{$name}.xcworkspace -scheme #{@scheme} -configuration Release -sdk iphoneos7.1 -derivedDataPath . CODE_SIGN_IDENTITY=\"#{@signature}\""
    puts `#{cmd}`
  end
  def generateIpa
    @appPath = "#{$projDir}/Build/Products/Release-iphoneos/#{@scheme}.app"
    cmd = "cd #{$projDir};xcrun -sdk iphoneos PackageApplication -v #{@appPath} -o #{$ipaFile} -sign \"#{@signature}\" -embed #{@profile}"
    puts `#{cmd}`
    #`cp #{$ipaFile} ~/Downloads`
  end
  def distribute(type)
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
    # for iOS version < 7.1
    File.directory?File.expand_path(self.httpBaseDir) or `mkdir #{self.httpBaseDir}`
    `sed "s##{self.ipaURL}##{self.httpIpaURL}#" #{self.plistFile} > #{self.httpPlistFile}`
  end
  def generateHtml()
    require 'json'
    plists = Dir.entries(File.expand_path(self.baseDir)).select{|x| File.extname(x) == ".plist"}.map{|x| "%s" % File.basename(x, ".plist")}
    params = {:urlRoot => "#{@baseURL}", :httpRoot => "#{@baseURL}", :plists => plists, :title => "#{@title}", :version => true}
    `jade --pretty --obj '#{params.to_json}' index.jade -o #{self.baseDir}`
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
  #baseURL = "https://dist.marboo.biz/k2k/"
  baseURL = "https://192.168.0.166:4443"
  @baseDir = "/Users/amoblin/Dropbox/Apps/Marboo/Projects/MyProjects/app-dist/public/"
  profile = "#{$projDir}/EnglishMofunShow_DEV.mobileprovision"
  signature = "iPhone Developer: Cui Guilin (CF3AN73YM2)"

  generator.setBase(baseURL, @baseDir, profile, $name, signature)

  generator.build()
  generator.generateIpa()
  generator.distribute("local")

  generator.generateHtml()
  #`rm -f #{@baseDir}index.html`
  generator.push()
end

task :inHouse do
  baseURL = "https://www.domain.name"
  @baseDir = "/Users/amoblin/Dropbox/Apps/Marboo/Projects/MyProjects/app-dist/public/"
  profile = "#{$projDir}/EnglishMofunShow_InHouse.mobileprovision"
  signature = "iPhone Distribution: MofunSky Technology (Beijing) Co., Ltd"
  @scheme = "mofunshowInHouse"
  generator.setBase(baseURL, @baseDir, profile, @scheme, signature)

  generator.build()
  generator.generateIpa()
  generator.distribute("local")
  generator.generateHtml()
  generator.push()
end

task :notify do |t|
  `say -v Moira Pay attention, guys. english mofun show revision #{$revision} is released. Please upgrade.`
  #`say -v Fiona Pay attention, guys. english mofun show revision #{$revision} is released. Please upgrade.`
  #`say -v Sin-ji 注意啦注意啦！英语魔方秀最新测试版#{$revision}版本发布啦~请大家不要挤，有序升级`
  #`say -v Sin-ji 注意啦注意啦！英语魔方秀最新测试版#{$revision}版本发布啦~请大家不要挤，有序升级`
  #`say -v Sin-ji 注意啦注意啦！英语魔方秀最新测试版#{$revision}版本发布啦~请大家不要挤，有序升级`
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

