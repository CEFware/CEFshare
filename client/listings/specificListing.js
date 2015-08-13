getCustomFields = function (listing) {
    var curType=listing.listingType;
    var custF=[];
    var defF=[];
    if (curType && Main.findOne()) {
        Main.findOne().listingFields.forEach(function (el) {
            if (el.listingType===curType)
                custF=el.listingFields;
        });
        if (!Main.findOne({'defaultListingFields.listingType':curType}))
            curType='DEFAULT';
        Main.findOne().defaultListingFields.forEach(function (el) {
            if (el.listingType===curType)
                defF=el.listingFields;
        });
	    
        var res=_.filter(custF,function (obj) {return !_.findWhere(defF, obj)});
	for (var i=0;i<res.length;i++) {
	    res[i].value=listing[res[i].name];
	};
	return res;
    };
};

Template.specificListing.helpers({
    listingImg: function (){
	var listing = specificListingByURI(Router.current().params.uri).fetch().first();
	if (listing) {
	    var imgs=Images.findOne({_id:listing.image[0]});
	    if (imgs)
		return imgs.url({store:'images'});
	};
    },

    listingImgs: function () {
	var listing = specificListingByURI(Router.current().params.uri).fetch().first();
	if (listing) {
	    var imgs=Images.find({_id:{$in:listing.image}});
	    if (imgs)
		return imgs;
	};
    },
    
    listingImgById: function (image){
	if (image) {
	    var imgs=Images.findOne({_id:image});
	    if (imgs)
		return imgs.url({store:'thumbs'});
	};
    },

    isListingsByAuthor: function (author){
	if ((specificListingByURI(Router.current().params.uri).fetch().first()) && (publicListingsByAuthor(author,specificListingByURI(Router.current().params.uri).fetch().first()._id,3).fetch().length>0))
	    return true;
	return false;
    },

    listingsByAuthor: function (author){
	if (specificListingByURI(Router.current().params.uri).fetch().first())
	    return publicListingsByAuthor(author,specificListingByURI(Router.current().params.uri).fetch().first()._id,3);
    },

    isListingsByTags: function (tags){
	if (tags && (specificListingByURI(Router.current().params.uri).fetch().first()) && (allListingsByTags(tags,specificListingByURI(Router.current().params.uri).fetch().first()._id,3).fetch().length>0))
	    return true;
	return false;
    },

    listingsByTags: function (tags){
	if (tags)
	    return allListingsByTags(tags,specificListingByURI(Router.current().params.uri).fetch().first()._id,3);
    },

    isRecentListings: function () {
	var uriArr=Cookie.get('recentListings');
	if (uriArr)
            uriArr = uriArr.split(",");
	if ((uriArr.length>0) && (specificListingByURI(Router.current().params.uri).fetch().first()) && (allListingsByURI(uriArr,specificListingByURI(Router.current().params.uri).fetch().first()._id,3).fetch().length>0))
	    return true;
	return false;
    },

    recentListings: function () {
	var uriArr=Cookie.get('recentListings');
        uriArr = uriArr.split(",");
	return allListingsByURI(uriArr,specificListingByURI(Router.current().params.uri).fetch().first()._id,3);
    },

    listing: function () {
	return specificListingByURI(Router.current().params.uri).fetch().first();
    },
    isFavorited: function () {
	var listing = specificListingByURI(Router.current().params.uri).fetch().first();
	if (listing)
	    return isListingFavorited(listing._id);
	return false;
    },
    isListingOwner: function () {
	return checkIfOwner();
    },
    currency: function (amount) {
	return accounting.formatMoney(amount);
    },
    customFields: function (listing) {
        //return only custom fields filable by seller
	return _.filter(getCustomFields(listing), function (el) {return (el.authorFilable && el.active)});
    },
    showClientFields: function (listing) {
	return (_.filter(getCustomFields(listing), function (el) {return !el.authorFilable})).length>0;
    },
    clientFieldsSchemaObj: function () {
	var listing=Listings.findOne({uri:Router.current().params.uri});
	var fields=_.filter(getCustomFields(listing), function (el) {return !el.authorFilable});
	var obj=[];
        fields.forEach(function (el){
            if (el.active) {
		var newField=ListingMain._schema[el.type];
		if (newField.type.name==="Array") {
                    var nObj = {};
                    nObj[el.name]=ListingMain._schema[el.type];
                    nObj[el.name].optional=el.optional;
                    nObj[el.name+'.$']=ListingMain._schema[el.type+'.$'];
                    nObj[el.name+'.$'].optional=el.optional;
                    obj.push(nObj);
		} else {
                    var nObj = {};
                    newField.optional=el.optional;
                    nObj[el.name]=newField;
                    obj.push(nObj);
		};
	    };
        });

	switch (listing.itemName) {
	    case 'item':
            obj.push({qtyToBuy:ListingMain._schema.qtyToBuy});
            obj.push({uri:ListingMain._schema.uri});
	    break;
	    case 'day':
            obj.push({datePick:ListingMain._schema.datePick});
            obj.push({qtyToBuy:ListingMain._schema.qtyToBuy});
            obj.push({uri:ListingMain._schema.uri});
	    break;
	    case 'hour':
            obj.push({dateTime:ListingMain._schema.dateTime});
            obj.push({qtyToBuy:ListingMain._schema.qtyToBuy});
            obj.push({uri:ListingMain._schema.uri});
	    break;
	};

	//if it's checked by listing owner - add required payeeEmail field for the invoice to be sent
	if (checkIfOwner) 
            obj.push({payeeEmail:ListingMain._schema.payeeEmail});


        var finSchema=new SimpleSchema(obj);
        var objL={};
        fields.forEach(function (el){
            objL[el.name]=eval("tmp=function () {return TAPi18n.__('"+el.title+"')}");
        });
        finSchema.labels(objL);
	
	var msg=TAPi18n.__("Start date can't be after End date.");
 	finSchema.messages({"wrongStartDate":msg});
	return finSchema;
    },
    showField: function (name,type) {
	if (Main.findOne()) {
        var pre=_.filter(Main.findOne().listingFields,function (el) {return el.listingType===type});
        if (pre.length>0) {
            var res = _.filter(pre[0].listingFields, function (el2) {return el2.name===name});
            if (res.length>0) 
                return res[0].active;
        };
        return false;
	};
    },
    showQtyToBuy: function (itemName) {
	if ((itemName==='item') || (itemName==='hour'))
	    return true;
	return false;
    },
    customField: function () {
	if ((this.name==='qtyToBuy') || (this.name==='datePick') || (this.name==='dateTime'))
	    return false;
	return true;
    },
    getDateRange: function (name) {
	if (name==='day')
	    return true;
	return false;
    },
    dateOptions: function () {
	var days=specificListingByURI(Router.current().params.uri).fetch().first().daysPick;
	if (!days)
	    days='';
	var dates=specificListingByURI(Router.current().params.uri).fetch().first().datePick;
	if (dates) {
	    dates=dates.split(',');
	    dates=_.union(dates,UnavailableDates.findOne().dates)
	} else {
	    dates="";
	};
	return {startDate: new Date(), 
		todayBtn: "linked", 
		todayHighlight: true, 
		multidate: true,
		datesDisabled: dates,
		daysOfWeekDisabled: days
	       }
    },
    getDays: function () {
	var res = Session.get('daysNum');
	if (res)
	    return res;
	return 1;
    },
    getStartTime: function (name) {
	if (name==='hour')
	    return true;
	return false;
    },
    dateTimeOptions: function () {
	var res=Meteor.user();
	var fin={minDate: new Date(), 
		useCurrent: true, 
		inline:true, 
		sideBySide:true, 
		todayHighlight: true, 
		showTodayButton:true
	       };
	if (res && res.profile && res.profile.notAvailableDates)
	    fin['disabledDates']=res.profile.notAvailableDates.split(',');
	if (res && res.profile && res.profile.notAvailableDays)
	    fin['daysOfWeekDisabled']=res.profile.notAvailableDays;
	return fin;
    },
    listingUri: function () {
	return Router.current().params.uri;
    },
    getTotal: function () {
	var listing=specificListingByURI(Router.current().params.uri).fetch().first();
	var res = Session.get('daysNum');
	if (listing)
	    if ((listing.itemName==='item') || (listing.itemName==='hour')) {
	    } else if (res) {
		return res*listing.price+(((res*listing.price)+listing.shippingFee)*listing.tax/100)+listing.shippingFee;;
	    } else {
		return listing.price+((listing.price+listing.shippingFee)*listing.tax/100)+listing.shippingFee;
	    };
    }
    
});

Template.specificListing.events({
    'click .switchFavorite': function (e,t) {
	e.preventDefault();
	if (Meteor.user()) {
	    var listing = specificListingByURI(Router.current().params.uri).fetch().first();
	    return switchFavoriteListingState(listing._id);
	};
    },

    'click #productMain .thumb': function (e,t) {
	e.preventDefault();
        $('#productMain .thumb').removeClass('active');
        var bigUrl = $(e.currentTarget).attr('href');
        $(e.currentTarget).addClass('active');
        $('#productMain #mainImage img').attr('src', bigUrl);
    } ,

    'click .deleteListing': function (e,t){
	e.preventDefault();
	//delete listing & images
	Meteor.call('deleteListing',specificListingByURI(Router.current().params.uri).fetch().first()._id, function (e,r) {
	    if (!e)
		Router.go('home');
	});
    },

    'change [name=datePick]': function (e,t) {
	var diffDays = $('[name=datePick]').val();
	if (diffDays)
	    diffDays=diffDays.split(',');
	Session.set('daysNum',diffDays.length);
    },
    
    'change [name=qtyToBuy]': function (e,t) {
	var listing=specificListingByURI(Router.current().params.uri).fetch().first();
	var res=Number($('[name=qtyToBuy]').val());
	res=res*listing.price+(((res*listing.price)+listing.shippingFee)*listing.tax/100)+listing.shippingFee;
	$('#listingQty').text('$'+res);
    }
});

Template.specificListing.rendered = function () {
    $('#jsToLoad').html('<script type="text/javascript" src="/js/jquery.cookie.js"></script><script type="text/javascript" src="/js/front.js"></script>');

	var listing=specificListingByURI(Router.current().params.uri).fetch().first();
	var res=Number($('[name=qtyToBuy]').val());
	res=res*listing.price+(((res*listing.price)+listing.shippingFee)*listing.tax/100)+listing.shippingFee;
	$('#listingQty').text('$'+res);


    Tracker.autorun (function (){
	Meteor.subscribe('wishlist');
	var listing = specificListingByURI(Router.current().params.uri).fetch().first();
	if (listing) {
	    Meteor.subscribe('userById',listing.author);
	    Meteor.subscribe('getPublicListingsByAuthor',listing.author);
	    if (listing.tags)
		Meteor.subscribe('getListingsByTags',listing.tags);
	    var uriArr=Cookie.get('recentListings');
	    if (uriArr)
		uriArr = uriArr.split(",");
	    if (uriArr.length>0)
		Meteor.subscribe('getListingsByURI',uriArr);
	    var imgA=[];
	    allListings().forEach(function(el){
		imgA=_.union(imgA, el.image);
 	    });
	    Meteor.subscribe('images',imgA);
	    var key=Meteor.users.findOne({_id:listing.author})
	    if (key && key.services.stripe && key.services.stripe.stripe_publishable_key)
		StripeCheckoutHandler = StripeCheckout.configure({
		    key: key.services.stripe.stripe_publishable_key,
		    token: function(token) {
			Meteor.call("CartPayForItems", token, Session.get('curBuyItem'), function(error, result) {
			    if (error) {
				alert(JSON.stringify(error));
			    }else{
				var order={};
				order.id=result.id;
				//we need to save all the carges id's to keep track the client orders
				Orders.update({_id:result.metadata.orderId}, {$set:{idStripe:result.id,status:"paid",stripeResult:result}});
				//initiate application_fee transfer from platform to marketplace owner
 
				var curm=Main.findOne();
				var fee=0;
				if (curm && curm.payments) {
				    switch (curm.payments.feeOrPercentage) {
				    case "fee":
					fee=curm.payments.fee;
					break;
				    case "percentage":
					fee=(result.amount/100)*curm.payments.percentage/100;
					fee=Number(fee.toFixed(2));
					break;
				    };
				};
 				
				var transferObj={
				    amount:Math.round(Number(fee*100)),
				    destination:Main.findOne().stripe.id, //key of marketplace owner
				    source_transaction: result.application_fee,
				    currency:result.currency
				};
				Meteor.call('appFeeFromPlatform',transferObj);
				alert("Payment Complete");
				Router.go('/user/'+Meteor.user().username+'/orders/'+result.id);
			    }
			});
		    }
		});

	};
    });
};

AutoForm.addHooks(['clientFields'],{
    onSuccess: function (formType,result){
	if (checkIfOwner()) {
	    //if called by listing owner - add payee e-mail to the schema & check if it exists & create invoice instead of order
	    //invoice creator don't need the shipping address
	    if (result) {
		var item = {};
		var listing = specificListingByURI(Router.current().params.uri).fetch()[0];
		if (listing) {
		    item.qty=result.qtyToBuy;
		    item.product=listing;
		    item.price=listing.price;
		    item.clientData=result;
		    Session.set('curBuyItem',[item]);
		    var total=item.qty*listing.price+listing.shippingFee;
		    total=total+total*listing.tax/100;
		    total=Number(total.toFixed(2));
		    //here we need to charge
/*		    StripeCheckoutHandler.open({
			description: 'Buy '+item.qty+' "'+listing.title + '" for $' + total,
			amount: Math.floor(total * 100),
			bitcoin:true
		    });
*/		};

		//create invoice document in Invoices collection
		//send out invoice to the payeeEmail
		//redirect to the invoice page
			
		Flash.success(1,TAPi18n.__("Thank you! Invoice went out to ")+result.payeeEmail,2000);
	    };

	} else {

            var res = Meteor.user();
            if (res) {
		if (res.profile && res.profile.firstName && res.profile.shipping && res.profile.shipping.firstLine && res.profile.shipping.city && res.profile.shipping.zip && res.profile.shipping.country) {

		    if (result) {
			var item = {};
			var listing = specificListingByURI(Router.current().params.uri).fetch()[0];
			if (listing) {
			    item.qty=result.qtyToBuy;
			    item.product=listing;
			    item.price=listing.price;
			    item.clientData=result;
			    Session.set('curBuyItem',[item]);
			    var total=item.qty*listing.price+listing.shippingFee;
			    total=total+total*listing.tax/100;
			    total=Number(total.toFixed(2));
			    //here we need to charge
			    StripeCheckoutHandler.open({
				description: 'Buy '+item.qty+' "'+listing.title + '" for $' + total,
				amount: Math.floor(total * 100),
				bitcoin:true
			    });
			};
			
			Flash.success(1,TAPi18n.__("Thank you!"),2000);
		    };

		} else {
                    alert(TAPi18n.__("Please, state your shipping address in PROFILE"));
		};
            } else {
		Router.go('entrySignIn');
            };

	};
 
    }
});
