# Copyright (C) 2005-2011 Splunk Inc. All Rights Reserved.  Version 4.3.1 
#
# This file contains potential attribute/value pairs to use when 
# configuring Windows Registry monitoring. The regmon-filters.conf file
# contains the regular expressions you create to refine and filter the
# registry key paths you want Splunk to monitor. 
#
# You must restart Splunk to enable configurations. 
# 
# To learn more about configuration files (including precedence) please see the
# documentation located at 
# http://docs.splunk.com/Documentation/Splunk/latest/Admin/Aboutconfigurationfiles

[<stanza name>]
* The name of the filter being defined.

proc = <regular expression>
* If set, is matched against the process name which performed the Registry
  access.
* Events generated by processes that do not match the regular expression are
  filtered out.
* Events generated by processes that match the regular expression are passed
  through.
* There is no default.

hive = <regular expression>
* If set, is matched against the registry key which was accessed.
* Events generated by processes that do not match the regular expression are
  filtered out.
* Events generated by processes that match the regular expression are passed
  through.
* There is no default.

type = <string>
* A regular expression that specifies the type(s) of Registry event(s)
  that you want Splunk to monitor.
* There is no default.

baseline = [0|1]
* Specifies whether or not to establish a baseline value for the Registry keys
  that this filter defines. 
* 1 to establish a baseline, 0 not to establish one.
* Defaults to 0 (do not establish a baseline).

baseline_interval = <integer>
* Splunk will only ever take a registry baseline only on registry monitoring
  startup.
* On startup, a baseline will be taken if registry monitoring was not running
  for baseline_interval seconds.  For example, if splunk was down for some
  days, or if registry monitoring was disabled for some days.
* Defaults to 86400 (1 day).

disabled = [0|1]
* Specifies whether the input is enabled or not.
* 1 to disable the input, 0 to enable it.
* Defaults to 0 (enabled).

index = <string>
* Specifies the index that this input should send the data to.
* This attribute is optional.  
* If no value is present, defaults to the default index.
