# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/focal64"
  config.vm.define "foosta" do |define|
  end
  config.vm.hostname = "foosta-host"

  #config.vm.synced_folder ".", "/vagrant", type: "nfs"

  config.vm.network "forwarded_port", guest: 9001, host: 8801
  #config.vm.network "private_network", type: "dhcp"
  config.vm.network "private_network", ip: "172.28.128.4"


  config.vm.provider "virtualbox" do |vb|
    vb.name = "vb_foosta"
    vb.customize ["modifyvm", :id, "--cpus", "2"]
    vb.customize ["modifyvm", :id, "--memory", "4096"]
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
  end
end
