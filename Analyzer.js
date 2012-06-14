
    String.prototype.noWhite = function () {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
    //Profile updating in conjunction with click data
    function updateProfile(strProfile, strClick) {
        dictProfile = profileToDict(strProfile);
        console.log(strClick);
        $.each(strClick.split(' '), function (i, e) {
            if (dictProfile[e] == null) {
                dictProfile[e] = 1;
            }
            else {
                dictProfile[e] = parseInt(dictProfile[e]) + 1;
            }
        });
        console.log(dictProfile);
        return dictToStr(dictProfile);
    }

    function EditProfile(strProfile, strClick, value) {
        dictProfile = profileToDict(strProfile);
        console.log(strClick);
        $.each(strClick.noWhite().split(' '), function (i, e) {
            if (dictProfile[e] == null) {
                dictProfile[e] = value;
            }
            else {
                dictProfile[e] = parseInt(dictProfile[e]) + value;
            }
        });
        console.log("EditProfile: " + dictProfile);
        return dictToStr(dictProfile);
    }


    //Profile maintaining
    function maintainProfile(strProfile, profileLength) {
        var dictProfile = profileToDict(strProfile);
        var arrProfile = dictToArray(dictProfile);
        if (arrProfile.length > 1) {

            while (arrProfile.length > 0 && arrProfile.length > profileLength) {
                arrProfile.pop();
            }

            while (arrProfile.length > 0 && arrProfile[arrProfile.length - 1].value <= 0) {
                arrProfile.pop();
            }


            for (var i = 1; i < arrProfile.length; i++) {
                arrProfile[i].value = arrProfile[i].value / arrProfile[0].value;

            }
            arrProfile[0].value = 1;
        }

        return arrayToStr(arrProfile);

    }

    //    //Profile maintaining
    //    function deleteFileds(strProfile, fields) {
    //        var dictProfile = profileToDict(strProfile);
    //        var arrProfile = dictToArray(dictProfile);
    //        for (key in dictProfile) {
    //            if (fields.indexOf(key) >= 0) {
    //                delete dictProfile[key];
    //            }
    //        }

    //    }


    function sBlock(element, strSemantic) {
        this.element = element;
        this.ratio = 0;
        this.strSemantic = strSemantic;
    }
    function rate(strProfile, strElement) {
        var ratio = 0.0;
        var incr = 1.0;
        var arrProfile = profileToDict(strProfile);
        for (var key in arrProfile) {
            if (strElement.indexOf(key) >=0) {
                ratio = ratio + incr;
                incr = 0.6 * incr;
            }
        }

        return ratio;
    }

    function compare(dictProfile, arElements) {
        for (key in dict) {

        }
    }

    function UIBlocker() {
    }
    UIBlocker.prototype = {
        block: function () {
        },

        unblock: function () {
        }
    }


    function SemanticAnalyzer(crossDomainStorage, diffRatio, topElement, semanticClassName) {
        this.crossDomainStorage = crossDomainStorage;
        this.diffRatio = diffRatio;
        this.topElement = topElement;
        this.semanticClassName = semanticClassName;
        this.statRating = 0.5;
        this.profileLength = 3;
    }

    SemanticAnalyzer.prototype = {

        //restore constructor
        constructor: SemanticAnalyzer,


        clearStatistics: function () {
            this.crossDomainStorage.setValue("semantic_stat", "");
        },


        getStatistics: function (callback) {
            this.crossDomainStorage.setValue("semantic_stat", "");
            this.crossDomainStorage.requestValue("semantic_stat", function (key, value) {
                callback(value);
            });
        },

        _sendStatistics: function (rating) {
            var success = 0;
            var failure = 0;
            if (rating > rating) {
                success += 1;
            }
            else {
                failure += 1;
            }
            var cs = this.crossDomainStorage;
            this.crossDomainStorage.requestValue("semantic_stat", function (key, value) {
                console.log("sendStatistics: " + value);
                var stat = profileToDict(value);
                if (stat['failure'] == null)
                    stat['failure'] = failure;
                else
                    stat['failure'] = parseInt(stat['failure']) + failure;
                if (stat['success'] == null)
                    stat['success'] = success;
                else
                    stat['success'] = parseInt(stat['success']) + success;
                cs.setValue("semantic_stat", dictToStr(stat));
            });

        },

        startUrlSniffer: function () {
            var cs = this.crossDomainStorage;
            var analyzer = this;
            $('.' + this.semanticClassName + ' a.link').click(function () {
                var attr = $(this).parents('.' + this.semanticClassName).attr('semantic');
                console.log(attr);
                cs.requestValue("semantic", function (key, value) {
                    var tmp = updateProfile(value, attr);
                    cs.setValue("semantic", tmp);
                    console.log("UrlSniffer: " + tmp);
                    return false;

                });

                var rating = $(this).parents('.' + this.semanticClassName).attr('rating');
                analyzer._sendStatistics(rating);
            });



            $('.semantic a.exclude').click(function () {
                var profileLength = analyzer.profileLength;
                var attr = $(this).parents('.' + analyzer.semanticClassName).attr('semantic');
                $(this).html("");
                console.log("vote_exlude_click: " + attr);
                cs.requestValue("semantic", function (key, value) {
                    var updProfile = EditProfile(value, attr, -1000);
                    updProfile = maintainProfile(updProfile, profileLength);
                    cs.setValue("semantic", updProfile);
                });

            });


            $('.' + this.semanticClassName + ' a.down').click(function () {
                $(this).html("");
                var attr = $(this).parents('.' + analyzer.semanticClassName).attr('semantic');
                console.log(attr + "exl--");
            });


            $('.' + this.semanticClassName + ' a.up').click(function () {
                var profileLength = analyzer.profileLength;
                var attr = $(this).parents('.' + analyzer.semanticClassName).attr('semantic');
                $(this).html("");
                console.log("vote_up_click: " + attr);
                cs.requestValue("semantic", function (key, value) {
                    var updProfile = EditProfile(value, attr, 100);
                    updProfile = maintainProfile(updProfile, 3);
                  //  console.log("----------" + updProfile);
                    cs.setValue("semantic", updProfile);
                });
               // return false;
            });
        },

        voteUp: function (attr) {


        },
        voteDown: function (attr) { },
        exlude: function (attr) { },


        analyze: function (callback) {
            this.crossDomainStorage.requestValue("semantic", function (key, value) {
                console.log(value);
                $(".semantic").each(function (i, e) {
                    var ratio = rate(value, $(e).attr('semantic'));
                    $(e).attr('rating', ratio);
                    if (ratio > 0)
                        $(e).find('div.updown a').css('color', "green").css("font-weight", "bold");
                    //console.log('rate demo--------' + rate(['v_rossii'], $(e).attr('semantic')));
                });
                var mylist = $('#topContent');
                var listItems = mylist.children('.semantic').get();
                callback(listItems);


                //                var mylist = $('#topContent');
                //                var listitems = mylist.children('.semantic').get();
                //                // console.log(listitems);
                //                listitems.sort(function (a, b) {
                //                    var compA = $(a).attr('rating');
                //                    var compB = $(b).attr('rating');
                //                    return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
                //                });
                //                $.each(listitems, function (idx, itm) { mylist.append(itm); });
            });
        }
    }
    $(function () {
        $.blockUI({ message: $('#blockUI') });
        $('#blockUIbtn').click(function () {
            $.unblockUI();
        });
        var remoteStorage = new CrossDomainStorage("http://localhost:49197", "/server.htm");
        var sa = new SemanticAnalyzer(remoteStorage, 2, "topContent", "semantic");
        sa.startUrlSniffer();
//        function fadeCallback(listitems) {
//            $.each(listitems, function (idx, itm) {
//                if ($(itm).attr('rating') < 2)
//                    $(itm).css({ opacity: 0.5 });

//            });
//        }


//        function reorderCallback(listitems) {
//            listitems.sort(function (a, b) {
//                var compA = $(a).attr('rating');
//                var compB = $(b).attr('rating');
//                return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
//            });
//            $.each(listitems, function (idx, itm) { mylist.append(itm); });
//        }


//        sa.analyze(function (listItems) {

//            $.each(listItems, function (idx, itm) {
//                if ($(itm).attr('rating') ==0)
//                    $(itm).css({ opacity: 0.5 });

//            });
//        });
        $.unblockUI();


        var geoService = new DataService(function () { return geoip_region_name(); });
        var manager = new DataServiceManager();
        manager.register(geoService);
        //   console.log(manager.getData());
    });
    // sa.sendStatistics(12);
