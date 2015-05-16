var os = require('os');

var nettools = function(opts) {
    if (false === (this instanceof nettools)) {
        return new nettools(opts);
    }

    this.debug = false;

    this.cb = null;

    this.opts = opts || {};
    this.opts.bannerlen = opts.bannerlen || 512;
    this.opts.timeout = opts.timeout || 2000;
    this.commands = {
      linux: {
        ping: {
          bin: '/bin/ping',
          count: '-c',
          size: '-s',
          timeout: '-W'
        },
        tracert: {
          bin: '/usr/bin/tracepath'
        }
      },
      win: {
        ping: {
          bin: 'C:/windows/system32/ping.exe',
          count: '-n',
          size: '-l',
          timeout: '-w'
        },
        tracert: {
          bin: 'C:/windows/system32/tracert.exe',
        }
      },
      darwin: {
        ping: {
          bin: '/bin/ping',
          count: '-c',
          size: '-s',
          timeout: '-t'
        },
        tracert: {
          bin: '/bin/traceroute'
        }
      }
    };
    this.currentPlatform = os.platform().replace(/^win.*/, "win");
    this.platformCommands = this.commands[this.currentPlatform];

    this.portDetails = {
      1: "TCP Port Service Multiplexer (TCPMUX)",
      5: "Remote Job Entry (RJE)",
      7: "ECHO",
      18: "Message Send Protocol (MSP)",
      20: "FTP -- Data",
      21: "FTP -- Control",
      22: "SSH Remote Login Protocol",
      23: "Telnet",
      25: "Simple Mail Transfer Protocol (SMTP)",
      29: "MSG ICP",
      37: "Time",
      42: "Host Name Server (Nameserv)",
      43: "WhoIs",
      49: "Login Host Protocol (Login)",
      53: "Domain Name System (DNS)",
      69: "Trivial File Transfer Protocol (TFTP)",
      70: "Gopher Services",
      79: "Finger",
      80: "HTTP",
      103: "X.400 Standard",
      108: "SNA Gateway Access Server",
      109: "POP2",
      110: "POP3",
      115: "Simple File Transfer Protocol (SFTP)",
      118: "SQL Services",
      119: "Newsgroup (NNTP)",
      137: "NetBIOS Name Service",
      139: "NetBIOS Datagram Service",
      143: "Interim Mail Access Protocol (IMAP)",
      150: "NetBIOS Session Service",
      156: "SQL Server",
      161: "SNMP",
      179: "Border Gateway Protocol (BGP)",
      190: "Gateway Access Control Protocol (GACP)",
      194: "Internet Relay Chat (IRC)",
      197: "Directory Location Service (DLS)",
      389: "Lightweight Directory Access Protocol (LDAP)",
      396: "Novell Netware over IP",
      443: "HTTPS",
      444: "Simple Network Paging Protocol (SNPP)",
      445: "Microsoft-DS",
      458: "Apple QuickTime",
      546: "DHCP Client",
      547: "DHCP Server",
      563: "SNEWS",
      569: "MSN",
      1080: "Socks"
    }

    this.requests = {};

    this.result = {
        ip:opts.ip,
        port:opts.port,
        bannerraw:[],
        banner:'',
        status:null,
        opened:false
    }

    this.socket = null;
    this.bufArray = [];

    /*
    var handlerModules = fs.readdirSync(__dirname+'/probes/');
    var handlers = [];

    for (var i = 0;i<handlerModules.length;i++) {
        var filename = handlerModules[i];
        if (filename.match(/\.js$/)) {
            var handler = require('./probes/'+filename);
            handlers.push(handler);
        }
    }
    */
}

nettools.prototype.getPortDescription = function(portNum) {
  if (this.portDetails[portNum] != null){
    return portNum + " - " + this.portDetails[portNum];
  } else {
    return portNum;
  }
}

nettools.prototype.newRequest = function() {
  var requestID = Date.now();
  this.requests[requestID] = {id: requestID, result: {}};
  return this.requests[requestID];
}

module.exports = nettools;
