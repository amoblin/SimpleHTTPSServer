# -*- coding: utf-8 -*-

$projDir = ""
$name="MusicFeeling"
$title = "傻瓜演奏家"
$ipaFile = "#{$projDir}/k2k.ipa"
$provisionProfile = "k2k_DEV.mobileprovision"

$templatePlistFile = "template.plist"
$signature = "iPhone Developer: Cui Guilin (CF3AN73YM2)"

$infoFile = "#{$projDir}/#{$name}/#{$name}-Info"
$plistFile = "#{$projDir}/#{$name}.plist"
$revision = `defaults read #{$infoFile} CFBundleVersion`.rstrip

$fileName = "%s_r%s" % [`date +%F`.rstrip, $revision]

$appPath = "#{$projDir}/Build/Products/Release-iphoneos/#{$name}.app"

class Generator
  def plistFile
    "%s/%s.plist" % [@baseDir, $fileName]
  end
  def ipaFileDir
    @baseDir
  end
  def distIpaFile
    "%s/%s.ipa" % [self.ipaFileDir, $fileName]
  end
  def ipaURL
    "%s%s.ipa" % [@baseURL, $fileName]
  end

  def httpBaseDir
    "%s/http" % @baseDir
  end
  def httpPlistFile
    "%s/%s.plist" % [self.httpBaseDir, $fileName];
  end
  def httpPlistURL
    "%shttp\\/%s.plist" % [@httpBaseURL, $fileName];
  end
  def httpIpaURL
    "%s%s.ipa" % [@httpBaseURL, $fileName];
  end

  attr_accessor :name, :title
  attr_accessor :baseURL, :baseDir, :httpBaseURL

  def initialize(name, title)
    @name = name
    @title = title
  end
  def setBase(baseURL, baseDir, httpBaseURL)
    @baseURL = baseURL
    @baseDir = baseDir
    @httpBaseURL = httpBaseURL
  end
  def build
    %x(cd #{$projDir};xcodebuild -workspace #{$name}.xcworkspace -scheme #{$name} -configuration Release -sdk iphoneos7.1 -derivedDataPath . clean)
    %x(cd #{$projDir};xcodebuild -workspace #{$name}.xcworkspace -scheme #{$name} -configuration Release -sdk iphoneos7.1 -derivedDataPath . CODE_SIGN_IDENTITY=\"#{$signature}\")
  end
  def generateIpa
    %x(cd #{$projDir};xcrun -sdk iphoneos PackageApplication -v #{$appPath} -o #{$ipaFile} -sign \"#{$signature}\" -embed #{$provisionProfile})
    #`cp #{$ipaFile} ~/Downloads`
  end
  def distribute(type)
    `cp #{$ipaFile} #{self.distIpaFile}`
    # first make sure code sing building setting for Release in Xcode is none
    `cp -f #{$templatePlistFile} #{self.plistFile}`
    `sed -i .bak "s/#URL/#{self.ipaURL}/" #{self.plistFile}`
    `sed -i .bak "s/#bundleId/#{$bundleId}/" #{self.plistFile}`
    `sed -i .bak "s/#bundleVersion/#{$bundleVersion}/" #{self.plistFile}`
    `sed -i .bak "s/#title/#{$revision}/" #{self.plistFile}`
    `rm -f #{self.plistFile}.bak`
    # for iOS version < 7.1
    File.directory?File.expand_path(self.httpBaseDir) or `mkdir #{self.httpBaseDir}`
    `sed "s/#{self.ipaURL}/#{self.httpIpaURL}/" #{self.plistFile} > #{self.httpPlistFile}`
  end
  def generateHtml(root, httpRoot)
    require 'json'
    plists = Dir.entries(File.expand_path(self.baseDir)).select{|x| File.extname(x) == ".plist"}.map{|x| "%s" % File.basename(x, ".plist")}
    params = {:urlRoot => "#{root}", :httpRoot => "#{httpRoot}", :plists => plists, :title => "#{@title}", :version => true}
    `jade --pretty --obj '#{params.to_json}' index.jade -o #{self.baseDir}`
  end
end

generator = Generator.new $name, $title

task :default do |t|
  puts `defaults read #{$infoFile} CFBundleShortVersionString`
  puts $revision
  puts `git log --pretty=oneline|wc -l`
end

task :xcode do |t|
  generator.build()
end

task :ipa => :xcode do |t|
  generator.generateIpa()
end

task :dist do
  # Local URL
  baseURL = "https:\\/\\/dist.marboo.biz\\/k2k\\/"
  @baseDir = "/Users/amoblin/Dropbox/Apps/Marboo/Projects/MyProjects/dist.marboo.biz/public/k2k"
  httpBaseURL = "http:\\/\\/dist.marboo.biz:2308\\/k2k\\/"

  generator.setBase(baseURL, @baseDir, httpBaseURL)
  generator.distribute("local")

  root = "https://dist.marboo.biz"
  httpRoot = "http://dist.marboo.biz"
  generator.generateHtml(root, httpRoot)
  #`rm -f #{@baseDir}index.html`
  `cd #{@baseDir};git add -A;git commit -m "r#{$revision} released";git push`
  #Rake.application.invoke_task("notify")
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

task :tr do |t|
  `find mofunshow -name "*.[hm]" | xargs sed -Ee 's/ +$$//g' -i ""`
  `find mofunshow -name "*.[hm]" | xargs sed -i .bak "s/^[ ]*$//g"`
end


task :icon do |t|
end

task :dmg => :xcode do |t|
  tag = `git describe --tag`
  filename = "#{name}_%s.dmg" % tag.rstrip
  sh "ln -sf /Applications /tmp/#{name}"
  sh "rm -rf ~/Downloads/%s" % filename
  sh "hdiutil create ~/Downloads/%s -srcfolder /tmp/#{name}" % filename
  sh "cp ~/Downloads/%s /tmp" % filename
end

task :tag do |t|
  puts `defaults write #{infoFile} CFBundleShortVersionString 0.1`
end
