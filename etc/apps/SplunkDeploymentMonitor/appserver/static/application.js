if (Splunk.util.getCurrentView()=='backfill_summary_indexes') {
//alert('in backfill view');
//var messenger = Splunk.Messenger.System.getInstance();
//messenger.send('info', 'splunk', "in backfill view");

  $('fieldset.backfill_indexes button').bind('click', function(){
     $.ajax({
        url: '/splunkd/services/admin/DM-backfill/backfill', 
        type: 'POST', 
        success: function(){
	    var messenger = Splunk.Messenger.System.getInstance();
            messenger.send('info', 'splunk', "Started backfilling summary indexes. This will take a while to complete");
        }
     });
  });

  $('fieldset.flush_and_backfill_indexes button').bind('click', function(){
     $.ajax({
        url: '/splunkd/services/admin/DM-backfill/flush', 
        type: 'POST', 
        success: function(){
	    var messenger = Splunk.Messenger.System.getInstance();
            messenger.send('info', 'splunk', "Flushed summary indexes. Backfilling summary indexes will take a while to complete.");
        }
     });
  });

}

if (Splunk.Module.SimpleResultsTable) {
    var isAllForwardersView  = ($("body.splView-all_forwarders").length>0)
    var isForwardersListView = ($("body.splView-forwarder_list").length>0)

    if (isAllForwardersView || isForwardersListView) {
    
        Splunk.Module.SimpleResultsTable = $.klass(Splunk.Module.SimpleResultsTable, {
            initialize: function($super, container) {
                var retVal = $super(container);

                // we'll use a little internal search to *do* things. 
                this._actionSID = null;
                // listen to the job events and look for our little internal 
                //    *action* job.  
                $(document).bind('jobDone', function(event, doneJob) {
                    if (this._actionSID && (this._actionSID == doneJob.getSearchId())) {
                        var messenger = Splunk.Messenger.System.getInstance();
                        messenger.send('info', 'splunk', "removed all missing forwarders from the list");
                        this.handleActionCompleted();
                    }
                }.bind(this));
                $("fieldset.mass_delete button").click(this.handleMassDeleteClick.bind(this));
                return retVal
            },

            // Dead Simple implementation - we just obliterate the forwarder lookup entirely.
            handleMassDeleteClick: function() {
                // annoying - you cant write 0 results to a lookup.  so i have to write a random "count=1" value. 
                //            inputlookup will find this bizarre count=1 value in here soon after, but the searches 
                //            wont care and will basically filter it out automatically.
                var search = new Splunk.Search('| inputlookup append=t known_forwarders  | head 1 | stats count | outputlookup known_forwarders');
                
                var onSuccess = function(search) {
                    var messenger = Splunk.Messenger.System.getInstance();
                    messenger.send('info', 'splunk', "clearing all old forwarders from the list");
                    this._actionSID = search.job.getSearchId();
                }.bind(this)
                var onFailure = function() {
                    var messenger = Splunk.Messenger.System.getInstance();
                    messenger.send('error', 'splunk', "error attempting to clear old forwarders from the list");
                }
                
                search.dispatchJob(onSuccess, onFailure);
            },

            handleActionCompleted: function() {
                this.withEachAncestor(function(module) {
                    // We traverse up the ancestor chain and stop at the first non-dispatching module
                    // and re-push there. 
                    if (!module.requiresDispatch()) {
                        module.pushContextToChildren();
                        return false;
                    }
                });
            },

            renderResults: function($super, result) {
                var retVal = $super(result);
                var moduleInstance = this;
                $("tr:has(td)", this.container).each(function() {
                    var tr = $(this);
                    var status = tr.find("td:nth-child(6)").text()
                    if (status == "missing") {
                        tr.addClass("missing");
                    } else if (status == "quiet") {
                        tr.addClass("quiet");
                    }
                });
                return retVal;
            }
        });
    }

}

if (Splunk.Module.SingleValue) {
    Splunk.Module.SingleValue = $.klass(Splunk.Module.SingleValue, {
        renderResults: function($super, result) {
            var retVal = $super(result);
            if (result==_("N/A")) {
                $(this._result_element).text("0");
            }
            return retVal;
        }
    });
}

if (Splunk.Module.BreadCrumb) {
    Splunk.Module.BreadCrumb = $.klass(Splunk.Module.BreadCrumb, {
        initialize: function($super, container) {
            var retVal = $super(container);
            $("a", container).unbind("click");
            return retVal
        },
        onJobCanceled: function() {}
    });
}

$(function() {
    var qsDict = Splunk.util.queryStringToProp(document.location.search);
    if ("pageTitle" in qsDict) {
        $(".DM_pageTitle h1").text(qsDict["pageTitle"])
    }
    
})

    
