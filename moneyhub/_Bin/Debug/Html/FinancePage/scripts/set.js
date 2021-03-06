/**addSubAccount，存储子账户信息的二维数组；
 */
var subAccount = new Array();
var newSubAccountId = 0;

/** 当前编辑状态
 */
var currentEditType = "edit";
var currentBankEditType = "add";
var currentPayeeEditType = "add";

/** 金融机构分类
 */
var classBank = 0;
var classFinance = 1;
var classPay = 2;

//获取所有币种
var listCurrency = getCurrencyInfo();
//获取所有存期
var duringData = getAccountSubDuringData();
//获取所有子账户类型
var listSubAccount = getSubAccountType();
//获取所有账户
var listAccount = getAccountList();
//取得分类
var listCategory = getCategoryInfo();
//获取所有一级分类
var listCategoryOut = getCategory1Info();
//获取所有收付款方
var listPayee = getPayeeInfo();
//获取所有金融机构
var listBank = getBankInfo(classBank);
var listFinance = getBankInfo(classFinance);
var listPay = getBankInfo(classPay);

/** currentTbAccountType，当前的用户类型
 */
var currentTbAccountType = -1;

var resWidth = 0;
var resHeight = 0;

var showAddAccount = "-1";
var showEditAccount = "-1";
var showEditSubAccount = "-1";
var showAddCategory = "-1";
var showAddPayee = "-1";

/** 天数选择
 */
var DaySelector = {
   initSeletor : function(id, state){
        var screem = $("#" + id + " span[id = 'rmday']"),
			up = $("#" + id + " a[id = 'rmup']"),
			down = $("#" + id + " a[id = 'rmdown']");
		
		var setState = function(state){
			screem.html(state);
			screem.attr("status", state);
		};
		
		var getState = function(){
			return parseInt(screem.attr("status"));
		};
		
		var getLimit = function(){
			return parseInt(screem.attr("limit"));
		};
		
		up.click(function(){
			var l = getLimit(),
				n = getState();
			if( n > 0 && n < l){
				setState(getState() + 1);
			}
		});
		
		down.click(function(){
			var l = getLimit(),
				n = getState();
			if( n > 1 && n <= l){
				setState(getState() - 1);
			}
		});
		
		if(typeof state !== 'undefined'){
			setState(state);
		}
    },
	
	setrmDayLimit : function(id, n){
        var screem = $("#" + id + " span[id = 'rmday']");
		screem.attr("limit", n);
		screem.attr("status", 3);
		screem.html(3); //默认为3天
	}
}

$(document).ready(function() {
	//获取所有账户列表
	createAccountList();

	//获取所有分类列表
	createCategoryList();

	//获取所有收付款方列表
	createPayeeList();

	//生成银行列表
	createBankList(listBank, classBank);
	createBankList(listPay, classPay);
	createBankList(listFinance, classFinance);
	//设置银行下拉框@huwence
	appendOption("newsa2_bank", listBank);
	appendOption("newsa3_bank", listBank);
	
	//设置投资机构下拉框@huwence
	appendOption("newsa8_bank", listFinance);

	//设置支付机构下拉框@huwence
	appendOption("newsa4_bank", listPay);

	//设置币种下拉框@huwence
	appendOption("newsa100_currency", listCurrency);
	appendOption("newsa101_currency", listCurrency);
	appendOption("newsa102_currency", listCurrency);
	appendOption("newsa201_currency", listCurrency);
	appendOption("newsa1_currency", listCurrency);
	appendOption("newsa2_currency", listCurrency);
	appendOption("newsa3_currency", listCurrency);
	appendOption("newsa4_currency", listCurrency);
	appendOption("newsa5_currency", listCurrency);
	appendOption("newsa6_currency", listCurrency);
	appendOption("newsa7_currency", listCurrency);
	appendOption("newsa8_currency", listCurrency);
	
	//存期@huwence
	appendOption("during", duringData);

	//一级分类@huwence
	appendOption("classout", listCategoryOut);

	//分类
	$("#Delclass select[name='category']").append("<option value='10065' cattype='0' mhvalue='(空)'>(空)</option>");
	$("#Delclass select[name='category']").append("<option value='10066' cattype='1' mhvalue='(空)'>(空)</option>");
	$.each(listCategory, function(i, n) {
		if (n.name2 == "CATA420") {
			$("#Delclass select[name='category']").append("<option value='" + n.id2 + "' cattype='" + n.Type + "' mhvalue='" + n.name1 + "' parentclass='" + n.id1 + "'>" + n.name1 + "</option>");
		} else {
			$("#Delclass select[name='category']").append("<option value='" + n.id2 + "' cattype='" + n.Type + "' mhvalue='" + n.name1 + " : " + n.name2 + "' parentclass='" + n.id1 + "'>" + n.name2 + "</option>");
		}
	});

	//设置收付款人下拉框
	$("#Delsfkf select[name='payee']").append("<option value='0'>(空)</option>");
	$.each(listPayee, function(i, n) {
		$("#Delsfkf select[name='payee']").append("<option value='" + n.id + "'>" + n.Name + "</option>");
	});

	//在页面的任何一个地方点击
	$(document).click(function() {
		$(".tSRSubaccount").hide();
	});
	
	//新建账户按钮
	$(".dSRnewaccount").click(function() {
		subAccount = [];
		renderSubAccountView(2);
		renderSubAccountView(3);
		showAdd("newaccount");
		changetextbg();
	});
	
	//新建账户类型时鼠标滑过动作
	$(".dAccountTypeImage img").mouseleave(function() {
		$(".dAccountTypeBottom").html("");
	});

	//点击新建银行
	$(".iNewBank").click(function() {
		editBank($(this).attr("banktype"), 0);
	});

	//点击三角时的动作	
	$(".iTree").toggle(function() {
		var myTR = $(this).parents(".tSRBrow");
		$(this).attr("src", "../images/tree2.gif");
		myTR.siblings("tr[mhparent='" + myTR.attr("mhclass") + "']").hide();
		myTR.siblings("tr[accountid='" + myTR.attr("accountid") + "'][subaccountid!='0']").hide();
	}, function() {
		var myTR = $(this).parents(".tSRBrow");
		$(this).attr("src", "../images/tree1.gif");
		myTR.siblings("tr[mhparent='" + myTR.attr("mhclass") + "']").show();
		myTR.siblings("tr[accountid='" + myTR.attr("accountid") + "'][subaccountid!='0']").show();
	});

	//创建自定义select
	customizeSelect();

	//自定义单选框
	customizeRadio();

	//切换标签
	tab_change("dSetPage", "h3", "div", "dSetRight");
	
	//日历 @huwence
	createSingleCalendar(".sdate");
	
	//调整屏幕大小
	initSize();
	
	//检查是否有变量需要我们显示
	TabActivated();

	//初始化天数选择器
	DaySelector.setrmDayLimit("newsa8", 10);
	DaySelector.initSeletor("newsa8", 3);//投资类账户
	
	DaySelector.setrmDayLimit("endDay-zd", 10);
	DaySelector.initSeletor("endDay-zd", 3);
	DaySelector.setrmDayLimit("endDay-zhk", 10);
	DaySelector.initSeletor("endDay-zhk", 3);//信用卡类账户	
	
	DaySelector.setrmDayLimit("newsa101", 10);
	DaySelector.initSeletor("newsa101", 3);
	DaySelector.setrmDayLimit("newsa102", 10);
	DaySelector.initSeletor("newsa102", 3);//存折储蓄卡类账户
});

//给初始余额赋初始值0.00
function changetextbg(){
	$("#balance").val("0.00");
	$("#1balance").val("0.00");
}

/**IE下select方法无法追加option标签，需要使用Option类进行创建 
*@huwence 
*/
function appendOption(id, list) {
	if (typeof(list) == "object"){
		var select = document.getElementById(id);
		try{
			if (select !== null){
				for (var i in list){
					if (id.indexOf("bank") >= 0) {
						select.options[i] = new Option(list[i].name.replace(/&/g,"&amp;"), list[i].id);
					} else {
						select.options[i] = new Option(list[i].Name, list[i].id);
					}
					//对于分类下拉框，为每个选项增添一个属性，以描述它属于收入还是支出
					if (id == "classout") {
						select.options[i].setAttribute("cattype", list[i].Type + 1);
					}
				}
			}
		} catch (e) {
			//TODO
		}	   
	} else {
		return false;
	}  
}

/** 窗口被激活时调用
 */
function TabActivated() {
	showAddAccount = "-1";
	showEditAccount = "-1";
	showEditSubAccount = "-1";
	showAddCategory = "-1";
	showAddPayee = "-1";
	
	try {
		showAddAccount = window.external.GetParameter("ShowAddAccount");
		window.external.SetParameter("ShowAddAccount", "-1");
		showEditAccount = window.external.GetParameter("ShowEditAccount");
		window.external.SetParameter("ShowEditAccount", "-1");
		showEditSubAccount = window.external.GetParameter("ShowEditSubAccount");
		window.external.SetParameter("ShowEditSubAccount", "-1");
		showAddCategory = window.external.GetParameter("ShowAddCategory");
		window.external.SetParameter("ShowAddCategory", "-1");
		showAddPayee = window.external.GetParameter("ShowAddPayee");
		window.external.SetParameter("ShowAddPayee", "-1");
	} catch (e) {
	}
	if ((showAddAccount != undefined) && (showAddAccount != "-1")) {
		closeAllPopup();
		$(".account").click();
		$(".dSRnewaccount").click();
	}
	if ((showEditAccount != undefined) && (showEditAccount != "-1")) {
		closeAllPopup();
		$(".account").click();
		$(".up tr[accountid=" + showEditAccount + "] .edit").click();
	}
	if ((showAddCategory != undefined) && (showAddCategory != "-1")) {
		closeAllPopup();
		$(".classification").click();
		addCategory(showAddCategory, 1, 0);
	}
	if ((showAddPayee != undefined) && (showAddPayee != "-1")) {
		closeAllPopup();
		$(".shoufu").click();
		editPayee(0);
	}
}

/** 关闭所有弹出框
 */ 
function closeAllPopup() {
	$(".addBox").each(function () {
		cancelAdd($(this).attr("id"), 1);
	});
}

/** 调整账户表格宽度
 */
function adjustAccountWidth() {
	//账户列表表格宽度
	$(".tSRBankcard").width($(".dSetRight").width() - 24);
	var cellWidth = ($(".tSRBankcard").width() - 181) / 3;
	$(".tSRBankcard .tSRBname1").width(cellWidth);
	$(".tSRBankcard .tSRBamount").width(cellWidth);
	$(".tSRBankcard .tSRBamount1").width(cellWidth);
	$(".tSRBankcard .tSRCAdd").width(90);
	$(".tSRBankcard .tSRCEdit").width(30);
	$(".tSRBankcard .tSRCDelete").width(30);
}	

/** 调整分类表格宽度
 */
function adjustPayWidth() {
	$(".tSRC_payout").width($(".dSRHalf").width());
	$(".tSRC_payout .tSRBname1").width($(".tSRC_payout").width() - 182);
	$(".tSRC_payout .tSRBname2").width($(".tSRC_payout").width() - 182);
	$(".tSRC_payout .tSRCEdit").width(30);
	$(".tSRC_payout .tSRCDelete").width(30);
}

/** 调整收付款方表格宽度
 */
function adjustPayeeWidth() {
	$(".tSRCorporation .tdSRC").width(($(".tSRCorporation").width() - 140) / 3);
	$(".tSRCorporation .tSRCEdit").width(30);
	$(".tSRCorporation .tSRCDelete").width(30);
}

function initSize() {
	try {
		resWidth = window.external.GetScreenWidth();
	} catch (e) {
		resWidth = 1024;
	}
	try {
		resHeight = window.external.GetScreenHeight() - 200;
	} catch (e) {
		resHeight = 568;
	}

	if (resWidth <= 973) {
		$(".dSetRight").width(752);
	} else {
		$(".dSetRight").width(resWidth - 225);
	}

	//标题栏宽度
	$(".dSRHalf").width(($(".dSetRight").width() - 20) / 2);
	$(".dSRCB2").width($(".dSRHalf").width() - 16);
	$(".dSRBB2").width($(".dSetRight").width() - 40);

	adjustAccountWidth();
	adjustPayWidth();

	//收付款方表格宽度
	$(".tSRCorporation").width($(".dSetRight").width() - 24);
	adjustPayeeWidth();

	$(".tSRCclass, .tSRCcontact").width((resWidth - 536)/2);
	
	//分类列表高度
	$(".dSRHalf").height(resHeight - 50);
	$("#dSetAccount").height(resHeight);
	$("#dPayee .customScrollBox").height(resHeight - 50);
	$("#dBank .customScrollBox").height(resHeight - 50);
}

//定期子账户到期日提醒判断
function  enddatejudge1(){
	$("#judge1").unbind("click");
	if($("#newsa101 input[name='sdate']").val() == ""){
	    alert("请选择到期日");
		if ($("#newsa101 .sCheckBox").hasClass("sCheckBox2") == true)
	    $("#newsa101 .sCheckBox").removeClass("sCheckBox2");	       
	}else{
		 if ($("#newsa101 .sCheckBox").hasClass("sCheckBox2") == true){
		 	$("#newsa101 .sCheckBox").removeClass("sCheckBox2");
		 	}else {$("#newsa101 .sCheckBox").addClass("sCheckBox2");}
	}		
}

//理财产品子账户到期日提醒判断
function  enddatejudge2(){
	$("#judge2").unbind("click");
	if($("#newsa102 input[name='sdate']").val() == ""){
	    alert("请选择到期日");
		if ($("#newsa102 .sCheckBox").hasClass("sCheckBox2") == true)
	    $("#newsa102 .sCheckBox").removeClass("sCheckBox2");	       
	}else{
		if ($("#newsa102 .sCheckBox").hasClass("sCheckBox2") == true){
		$("#newsa102 .sCheckBox").removeClass("sCheckBox2");
		}else{$("#newsa102 .sCheckBox").addClass("sCheckBox2");}
	}		
}

//投资账户到期日提醒判断
function  enddatejudge3(){
	$("#judge3").unbind("click");
	if($("#newsa8 input[name='sdate']").val() == ""){
	    alert("请选择到期日");
		if ($("#newsa8 .sCheckBox").hasClass("sCheckBox2") == true)
	    {$("#newsa8 .sCheckBox").removeClass("sCheckBox2");}	       
	}else{	   
	     if($("#newsa8 .sCheckBox").hasClass("sCheckBox2") == true) {
		 	$("#newsa8 .sCheckBox").removeClass("sCheckBox2");
		 }else{
		 	 	$("#newsa8 .sCheckBox").addClass("sCheckBox2");
		 	  }
	
	}		
}

//信用卡账单日的到期日提醒判断
function  zddatejudge(){
	$("#zddate").unbind("click");
	if($("#newsa2 input[name='billdate']").val() == ""){
	    alert("请输入账单日");
		if ($("#zddate").hasClass("sCheckBox2") == true)
	    $("#zddate").removeClass("sCheckBox2");	       
	}else{
		if ($("#zddate").hasClass("sCheckBox2") == true){$("#zddate").removeClass("sCheckBox2");}
		else{$("#zddate").addClass("sCheckBox2");}
	}		
}

//信用卡最后还款日的到期日提醒判断
function  zhkdatejudge(){
	$("#zhkdate").unbind("click");
	if($("#newsa2 input[name='returndate']").val() == ""){
	    alert("请输入最后还款日");
		if ($("#zhkdate").hasClass("sCheckBox2") == true)
	    $("#zhkdate").removeClass("sCheckBox2");	       
	}else{
		if ($("#zhkdate").hasClass("sCheckBox2") == true){$("#zhkdate").removeClass("sCheckBox2");}
		else{$("#zhkdate").addClass("sCheckBox2");}
	}		
}

/** 生成账户列表中的一项
 * @param AccountType 账户类型
 * @param SubAccountType 子账户类型
 * @param AccountId 主账户号
 * @param SubAccountId 子账户号
 * @param accountSonNumber 子账户个数
 * @param AccountName 账户名
 * @param Comment 备注 
 * @param CurrencyId 币种
 * @param AccountBalance 余额
 * @param BankId 银行
 * @param Days 理财期限
 * @param EndDate 到期日   
 * @return 生成的内容   
 */
function GenerateAccount(AccountType, SubAccountType, AccountId, SubAccountId, accountSonNumber, AccountName, Comment, CurrencyId, AccountBalance, BankId, Days, EndDate) {
	if(CurrencyId == 1){CurrencyName = "人民币";}
	if(CurrencyId == 2){CurrencyName = "美元";}
	if(CurrencyId == 3){CurrencyName = "欧元";}
	if(CurrencyId == 4){CurrencyName = "日元";}
	if(CurrencyId == 5){CurrencyName = "英镑";}
	if(CurrencyId == 6){CurrencyName = "港币";}
	if(CurrencyId == 7){CurrencyName = "加拿大元";}
	if(CurrencyId == 8){CurrencyName = "澳元";}
	if(CurrencyId == 9){CurrencyName = "瑞士法郎";}
	if(CurrencyId == 10){CurrencyName = "新加坡元";} 
	AccountName = AccountName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;");

	if (SubAccountType == 0) {
		//主账户 
		content = '<tr class="tSRBrow" accountid="' + AccountId + '" subaccountid="' + SubAccountId + '" currency="' + CurrencyId + '" bankid="' + BankId + '" accountname="' + AccountName + '" days="' + Days + '" enddate="' + EndDate + '" comment="' + Comment + '"><td class="tSRBname1"><div class="dSRBname1"><nobr>';
	} else {
		content = '<tr class="tSRBrow" accountid="' + AccountId + '" subaccountid="' + SubAccountId + '" currency="' + CurrencyId + '" accountname="' + AccountName + '" days="' + Days + '" enddate="' + EndDate + '" comment="' + Comment + '"><td class="tSRBname1"><div class="dSRBname2"><nobr>';
	}

	//多于一个子账户的
	if (accountSonNumber > 0)
		content += '<img src="../images/tree1.gif" class="iTree" />';
	content += AccountName + '</nobr></div></td>'
		+ '<td class="tSRBamount">' + AccountBalance + '</td>'
		+ '<td class="tSRBamount1">'+ CurrencyName + '</td>' + '<td class="tSRCAdd">';
	if ((SubAccountId == 0) && ((AccountType == 2) || (AccountType == 3))) {
		content += '<span class="newsubaccount" atid="' + AccountType + '">新增子账户</span>';
	}
	content += "</td>";
	if (SubAccountType == 0) {
		//主账户
		aid = '$(this).parents(\'.tSRBrow\').attr(\'accountid\')';
		bid = '$(this).parents(\'.tSRBrow\').attr(\'subaccountid\')';
		content += '<td class="tSRCEdit"><img class="edit" width="11" height="11" alt="编辑" src="images/edit.gif" onclick="AddSA(' + AccountType + ', ' + aid + ', ' + bid + ')"></td>'
			+ '<td class="tSRCDelete"><img class="delete" width="12" height="11" alt="删除" src="images/delete.gif" onclick="showDeleteAccount(' + AccountType + ', ' + aid + ', 0)"></td>';
	} else {
		//子账户
		aid = '$(this).parents(\'.tSRBrow\').attr(\'accountid\')';
		bid = '$(this).parents(\'.tSRBrow\').attr(\'subaccountid\')';
		content += '<td class="tSRCEdit">'
		if (AccountType == 3) {
			//只有储蓄卡的子账户可以编辑
			content += '<img class="edit" width="11" height="11" alt="编辑" src="images/edit.gif" onclick="AddSA(' + SubAccountType + ', ' + aid + ', ' + bid + ')">';
		}
		content += '</td><td class="tSRCDelete"><img class="delete" width="12" height="11" alt="删除" src="images/delete.gif" onclick="showDeleteAccount('+ AccountType + ', ' + aid + ', ' + bid + ')"></td>';
	}
	content += '</tr>';
	return content;
}

/** 生成分类列表中的一项
 * @param CatType 类型
 * @param CatId1 主分类编号
 * @param CatId2 子分类编号
 * @param CatName1 主分类名称
 * @param CatName2 子分类名称
 * @return 生成的内容   
 */
function GenerateCategory(CatType, CatId1, CatId2, CatName1, CatName2) {
	if (CatName2 == "CATA420") {
		//一级分类 
		content = '<tr class="tSRBrow" mhclass="' + CatId1 + '" mhparent="0" catname="' + CatName1 + '">'
			+ '<td class="tSRBname1"><div class="dSRBname1"><nobr><img class="iTree" src="../images/tree1.gif">' + CatName1 + '</nobr></div></td>'
			+ '<td class="tSRCAdd"><img class="add newout2" width="11" height="11" alt="add" src="images/add.gif" onclick="addCategory(' + CatType + ', 2, ' + CatId1 + ', 0);" /></td>'
			+ '<td class="tSRCEdit"><img class="edit" width="11" height="11" alt="edit" src="images/edit.gif" onclick="addCategory(' + CatType + ', 1, ' + CatId1 + ', 0);" /></td>'
			+ '<td class="tSRCDelete"><img class="delete" width="12" height="11" alt="delete" src="images/delete.gif" onclick="showDeleteCategory(' + CatType + ', 1, ' + CatId1 + ');" /></td>'
			+ '</tr>';
	} else {
		//二级分类
		content = '<tr class="tSRBrow" mhparent="' + CatId1 + '" mhclass="' + CatId2 + '" catname="' + CatName2 + '">'
			+ '<td class="tSRBname1"><div class="dSRBname2"><nobr>' + CatName2 + '</nobr></div></td>'
			+ '<td class="tSRCAdd">&nbsp;</td>'
			+ '<td class="tSRCEdit"><img class="edit" width="11" height="11" alt="edit" src="images/edit.gif" onclick="addCategory(' + CatType + ', 2, ' + CatId1 + ', ' + CatId2 + ');" /></td>'
			+ '<td class="tSRCDelete"><img class="delete" width="12" height="11" alt="delete" src="images/delete.gif" onclick="showDeleteCategory(' + CatType + ', 2, ' + CatId2 + ');" /></td>'
			+ '</tr>';
	}
	return content;
}

/** 生成收付款方列表中的一项
 * @param PayeeId 编号
 * @param PayeeName 姓名
 * @param PayeeTel 电话
 * @param PayeeEmail 邮件
 * @return 生成的内容   
 */
function GeneratePayee(PayeeId, PayeeName, PayeeTel, PayeeEmail) {
	content = '<tr class="tSRCrow" payeeid="' + PayeeId + '" payeepinyin="' + getGB2312Spell(PayeeName) + '">'
		+ '<td class="tdSRC tSRCname">' + PayeeName + '</td>'
		+ '<td class="tdSRC tSRCclass">' + PayeeTel + '</td>'
		+ '<td class="tdSRC tSRCcontact">' + PayeeEmail + '</td>'
		+ '<td class="tSRCEdit"><img class="edit" src="images/edit.gif" width="11" height="11" alt="edit" onclick="editPayee(' + PayeeId + ');" /></td>'
		+ '<td class="tSRCDelete"><img class="delete" src="images/delete.gif" width="12" height="11" alt="delete" onclick="showDeletePayee(' + PayeeId + ');" /></td>'
		+ '</tr>';
	return content;
}

/** 生成银行列表中的一项
 * @param BankId 编号
 * @param BankName 姓名
 * @param BankWebsite 联系方式
 * @return 生成的内容   
 */
function GenerateBank(BankId, BankName, BankType, BankWebsite) {
	BankTypeArray = new Array();
	BankTypeArray[classBank] = "银行";
	BankTypeArray[classFinance] = "投资机构";
	BankTypeArray[classPay] = "第三方支付机构";
	BankTypeName = BankTypeArray[BankType];
	content = '<tr class="tSRCrow" bankid="' + BankId + '"  banktype1="' + BankType + '"  BankNamePinyin="' + getGB2312Spell(BankName) + '">'
		+ '<td class="tdSRC tSRCname">' + BankName + '</td>'
		+ '<td class="tdSRC">' + BankTypeName + '</td>'
		+ '<td class="tdSRC">' + BankWebsite + '</td>'
		+ '<td class="tSRCEdit"><img class="edit" src="images/edit.gif" width="11" height="11" alt="edit" onclick="editBank(' + BankType + ', ' + BankId + ')" /></td>'
		+ '<td class="tSRCDelete"><img class="delete" src="images/delete.gif" width="12" height="11" alt="delete" onclick="handleDeleteBank(' + BankType + ', ' + BankId + ')" /></td>'
		+ '</tr>';
	return content;
}

/** 生成账户列表
 */
function createAccountList() {
	//取得账户与子账户的对应情况
	try {
		result1 = JSON.parse(window.external.QuerySQL("SELECT COUNT(DISTINCT(b.id)) AS myNumber, a.id AS aid FROM tbAccount a, tbSubAccount b WHERE a.id=b.tbAccount_id  and a.tbaccountType_id in (2,3) GROUP BY a.id"));
	} catch (e) {
		result1 = [{
			"myNumber": 2,
			"aid": 1
		},{
			"myNumber": 1,
			"aid": 8
		},{
			"myNumber": 1,
			"aid": 9
		}];
	}

	//清空数据层
	var aId = "";
	var content = "";
	var accountSonNumber = 0;
	var k = 0;
	var totalAmount = 0;

	$.each(listAccount, function(i, n) {
		//显示相应的账户分类
		$("#dAT" + n.tid).show();

		//判断是否为统一账户
		//判断是否为1对1账户
		if (aId == n.aid) {
			k++;
		} else {
			aId = n.aid;
			k = 0;
		} 
		if ((n.tid == 2) || (n.tid == 3)) {
			//有子账户的
			accountSonNumber = 0;
			$.each(result1, function(j, m) {
				if (m.aid == n.aid) {
					//取得当前的子分类的总数
					accountSonNumber = m.myNumber;
					return false;
				}
			});
			if (k == 0) {
				//新的，第一个
				content = GenerateAccount(n.tid, 0, n.aid, 0, accountSonNumber, n.aname, n.acomment, n.tbCurrency_id, 0, n.tbBank_id);
				$("#tAT" + n.tid).append(content);
			}
			//生成子账户层
			content = GenerateAccount(n.tid, n.tid2, n.aid, n.bid, 0, n.bname, n.bcomment, n.tbCurrency_id, n.Balance, 0, n.Days, n.EndDate);
			$("#tAT" + n.tid).append(content);
			content = $(content);
			if (k == (accountSonNumber - 1)) {
				//最后一个
				//计算主账户总金额
				var totalAmount = 0;
				$("#tAT" + n.tid + " tr[accountid='" + n.aid + "'][subaccountid!='0']").each(function () {
					totalAmount += Math.round(getRMBExchangeInfo2($(this).attr("currency")) * parseFloat($(this).children(".tSRBamount").html())) / 100;
				});
				totalAmount = formatnumber(totalAmount, 2);   
				$("#tAT" + n.tid + " tr[accountid='" + n.aid + "'][subaccountid='0']").children(".tSRBamount").html(totalAmount);
				$("#tAT" + n.tid + " tr[accountid='" + n.aid + "'][subaccountid='0']").children(".tSRBamount1").html("人民币");
			}
		} else {
			//无子账户的
			content = GenerateAccount(n.tid, 0, n.aid, n.bid, 0, n.aname, n.acomment, n.tbCurrency_id, n.Balance, n.tbBank_id, n.Days, n.EndDate);
			$("#tAT" + n.tid).append(content);
		}
	});
	
	//新建子账户按钮
	$(".newsubaccount").unbind("click").click(function(event) {
		event.stopPropagation();
		if ($(this).attr("atid") == 2) {
			//显示信用卡子账户窗口
			AddSA(201, $(this).parents(".tSRBrow").attr('accountid'), 0);
		} else {
			//显示借记卡子账户窗口
			$(".tSRSubaccount").find("li").attr("accountid", $(this).parents(".tSRBrow").attr("accountid"));
			$(".tSRSubaccount").css("top", $(this).offset().top + 20);								   
			$(".tSRSubaccount").toggle();
		}								   
	});
	
	//左侧账户列表名字宽度
	$(".sMAName").width($("#accountList").width() - 130);
	$(".sMAName").each(function(i) {
		maxLen = $(".sMAName").width() / 13;
		var finalFullName = $(this).attr("fullname").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		if ($(this).attr("fullname").length > maxLen) {
			$(this).html(finalFullName.substring(0, maxLen - 1) + "…");
		} else {
			$(this).html(finalFullName);
		}
	});
}

/** 生成分类表
 */
function createCategoryList() {
	$.each(listCategory, function(i, n) {
		var legalName1 = n.name1.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;");
		var legalName2 = n.name2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;");
		content = GenerateCategory(n.Type, n.id1, n.id2, legalName1, legalName2);
		$("#tC" + n.Type).append(content);
	});
}

/** 生成收付款方表
 */
function createPayeeList() {
	$.each(listPayee, function(i, n) {
		content = GeneratePayee(n.id, n.Name, n.tel, n.email);
		$("#tPayee").append(content);
	});
}

/** 生成金融机构表
 */
function createBankList(list, listType) {
	$.each(list, function(i, n) {
		if (n.id >= 10000) {
			if(n.Website == undefined)
			{n.Website="";}
			content = GenerateBank(n.id, n.name, listType, n.Website);
			$("#tBank").append(content);
		}
	});
}

/** 显示添加子账户窗口
 * @param TypeId 账户类型
 * @param AccountId 主账户编号 
 * @param SubAccountId 子账户编号 
 * @param flag 编辑是否清空
 */ 
function AddSA(TypeId, AccountId, SubAccountId, flag) {
	var BoxName = "#newsa" + TypeId + "boxBg";
	$(BoxName + " input[name='balance']").val("0.00");
	if (flag == undefined){
	    $(BoxName + " input").val("");
		$(BoxName + " input[name='balance']").val("0.00");
		$(BoxName + " input[name='1balance']").val("0.00"); 
	    $(BoxName + " .sCheckBox").removeClass("sCheckBox2");
	    $(BoxName + " span[id='rmday']").html(3);//默认为前三天
	}
	$(BoxName + " textarea").val("");
	//编辑时不显示余额框
	if (((TypeId < 100) && (AccountId != 0)) || (SubAccountId != 0)) {
		if ((SubAccountId > 99999999) || (SubAccountId < 0)) {
			$(BoxName + " input[name='balance']").parents(".dEAItem").show();
		} else {
			$(BoxName + " input[name='balance']").parents(".dEAItem").hide();
		}
	} else {
		$(BoxName + " input[name='balance']").parents(".dEAItem").show();
	}
	showAdd("newsa" + TypeId);
	if (TypeId < 100) {
		//主账户
         if (AccountId == 0) {
			//新建
			currentEditType = "add";
			$(BoxName + " h1").html($(BoxName + " h1").html().replace("编辑", "新建"));//若点击编辑后，改变回新建
		    if (TypeId == 4) {
				selectOption(BoxName, "bank", listPay[0].id);
			}
		    if (TypeId == 8) {
				selectOption(BoxName, "bank", listFinance[0].id);
			}
       		if ((TypeId != 2) && (TypeId != 3)) {
       			//设置主账户币种
				selectOption(BoxName, "currency", 1);
			}

			if ((TypeId == 2) || (TypeId == 3)) {
				selectOption(BoxName, "bank", listBank[0].id);
				//添加信用卡或借记卡窗口有一个按钮：下一步
				$(BoxName + ' .boxBg8 .oplist').html("<li><span class='next_btn'></span></li>");
				$(BoxName + ' .boxBg8 .oplist .next_btn').unbind().click( function(){
					if (myFormValidate('#newsa' + TypeId + '_form')) {
						$(BoxName).hide();
						showAdd("suba" + TypeId);
					}
				});
			}
		} else {
			//编辑
			currentEditType = "edit";
			if (TypeId == 2) {
				$(BoxName + " h1").html("编辑信用卡");
			} else {
				$(BoxName + " h1").html("编辑基本信息");
			}

			$(BoxName + " input[name='AccountId']").val(AccountId);

			targetRow = $("#tAT" + TypeId + " tr[accountid='" + AccountId + "']").first();
       		if ((TypeId == 2) || (TypeId == 3) || (TypeId == 4) || (TypeId == 8)) {
       			//有银行的，选银行
				selectOption(BoxName, "bank", targetRow.attr("bankid"));
			}

       		if ((TypeId != 2) && (TypeId != 3)) {
       			//没有子账户的，选中其唯一子账户
       			$(BoxName + " input[name='SubAccountId']").val(SubAccountId);
       			//设置主账户币种
				selectOption(BoxName, "currency", targetRow.attr("currency"));
       		}
       		
       		$(BoxName + " input[name='AccountName']").val(targetRow.attr("accountname"));
       		if(targetRow.attr("comment") == "undefined"){
				targetRow.attr("comment") = "";	   
			}
       		$(BoxName + " textarea[name='description']").val(targetRow.attr("comment"));
			setEditDateAlarm(TypeId, AccountId, SubAccountId);
		}
	} else {
		//子账户
		if (SubAccountId == 0) {
			//新建
			$(BoxName + " h1").html($(BoxName + " h1").html().replace("编辑", "新建"));//若点击编辑后，改变回新建
			$(BoxName + " input[name='subName']").val("");
			//设置子账户币种
			selectOption(BoxName, "currency", 1);
			if (BoxName == "#newsa101boxBg") {
				selectOption(BoxName, "during", 0);
			} else if (BoxName == "#newsa102boxBg") {
				$(BoxName + " input[name='during']").val("");
			}
		} else {
			//编辑
			var subsaId = TypeId;
			TypeId = 3;
			$(BoxName + " h1").html($(BoxName + " h1").html().replace("新建", "编辑"));
			if ((SubAccountId > 99999999) || (SubAccountId < 0)) {
				//新建主账户时的表
       			targetRow = $("#suba3 .dRightTable tr[subaccountid='" + SubAccountId + "']");
				selectOption(BoxName, "currency", targetRow.attr("currency"));
			} else {
				//账户大列表
       			targetRow = $("#tAT" + TypeId + " tr[accountid='" + AccountId + "'][subaccountid='" + SubAccountId + "']");
       		}
			$(BoxName + " input[name='balance']").val(targetRow.attr("balance"));
			$(BoxName + " input[name='subName']").val(targetRow.attr("accountname"));
       		$(BoxName + " textarea[name='description']").val(targetRow.attr("comment"));
			if (BoxName == "#newsa101boxBg") {
				selectOption(BoxName, "during", targetRow.attr("days"));
			} else if (BoxName == "#newsa102boxBg") {
				$(BoxName + " input[name='during']").val(targetRow.attr("days"));
			}
			setEditDateAlarm(TypeId, AccountId, SubAccountId, subsaId);
		}
	}
	$(BoxName + " input[name='AccountId']").val(AccountId);
	$(BoxName + " input[name='SubAccountId']").val(SubAccountId);
	$(BoxName + " input[name='AccountType']").val(TypeId);
}

function setEditDateAlarm(TypeId, AccountId, SubAccountId, subsaId){
     var name, subName, eventDescription;
	 var BoxName = "#newsa" + TypeId + "boxBg";
	 
     if (TypeId == 2) {
	    name = $(BoxName + " input[name='AccountName']").val();
		subName = $("#tAT" + TypeId + " tr[accountid='" + AccountId + "']").next().attr("accountname");
		eventDescription = (name + " " + subName + "到期").replace(/^\s+(.*?)\s+$/, "$1");
	    var descriptionZ = name + " " + subName  + "账单日\t到期",//账单日事件
		    descriptionH = name + " " + subName  + "还款日\t\t到期";//还款日事件
	    var alarmEnddateZ = getEventDateAlarmByName(descriptionZ),
		    alarmEnddateH = getEventDateAlarmByName(descriptionH);
		var alarmZ = alarmEnddateZ["alarm"],
			alarmH = alarmEnddateH["alarm"];
		var	enddateZ = alarmEnddateZ["enddate"].substring(8, 10),
			enddateZ_ = (parseInt(enddateZ) == 0) ?  alarmEnddateZ["enddate"].substring(9, 10) : enddateZ;
		var	enddateH = alarmEnddateH["enddate"].substring(8, 10),
			enddateH_ = (parseInt(enddateH) == 0) ?  alarmEnddateH["enddate"].substring(9, 10) : enddateH;
		if (alarmZ != undefined && enddateZ != undefined){
		    $(BoxName + " span[id='zddate']").addClass("sCheckBox2");		
		    $(BoxName + " span[id='rmday']").html(alarmZ);
		    $(BoxName + " input[id='billdate']").val(enddateZ_);    
		}
		if (alarmH != undefined && enddateH != undefined){
		    $(BoxName + " span[id='zhkdate']").addClass("sCheckBox2");		
		    $(BoxName + " span[id='rmday']").html(alarmH);
		    $(BoxName + " input[id='returndate']").val(enddateH_);
		}
	 }else if (TypeId == 3){
	    name = $("#tAT" + TypeId + " tr[accountid='" + AccountId + "'][subaccountid='0']").attr("accountname");
        subName = $("#tAT" + TypeId + " tr[accountid='" + AccountId + "'][subaccountid='"+ SubAccountId +"']").attr("accountname");
	    eventDescription = (name + " " + subName + "到期").replace(/^\s+(.*?)\s+$/, "$1");
	    var alarmEnddate = getEventDateAlarmByName(eventDescription),
	        alarm = alarmEnddate['alarm'],
	        enddate = alarmEnddate['enddate'];
	    if (subsaId != undefined && alarm != undefined && enddate != undefined){
            $("#newsa" + subsaId + " .sCheckBox").addClass("sCheckBox2");
		    $("#newsa" + subsaId + " span[id='rmday']").html(alarm);
		    $("#newsa" + subsaId + " input[name='sdate']").val(enddate);
		}
	 }else if (TypeId == 8){
	    name = $(BoxName + " input[name='AccountName']").val();
	    subName = "";
		eventDescription = (name + " " + subName + "到期").replace(/^\s+(.*?)\s+$/, "$1");
		var alarmEnddate = getEventDateAlarmByName(eventDescription),
	        alarm = alarmEnddate['alarm'],
	        enddate = alarmEnddate['enddate'];
		if (alarm != undefined && enddate != undefined){
			$(BoxName + " .sCheckBox").addClass("sCheckBox2");	
			$(BoxName + " span[id='rmday']").html(alarm);
			$(BoxName + " input[name='sdate']").val(enddate);
	    }
	 }
}

/** 切换一级分类和二级分类
 */
function switchCatLevel(CatLevel) {
	$("#Newpayout2 input[name='CategoryLevel']").val(CatLevel);
	if (CatLevel == 1) {
		$(".parentclass").hide();
	} else {
		$("#dHideParent").show();
		$(".parentclass").show();
		$("#dHideParent").hide();
	}
}

/** 显示添加分类对话框
 * @param CatType 分类类型，0表示支出，1表示收入
 * @param CatLevel 分类级别
 * @param CatId1 主分类编号
 * @param CatId2 子分类编号 
 */
function addCategory(CatType, CatLevel, CatId1, CatId2) {
	showAdd("Newpayout2");
	$("#Newpayout2 input").val("");
	$("#Newpayout2 input[name='CategoryType']").val(CatType);
	$("#Newpayout2 input[name='CategoryLevel']").val(CatLevel);
	$("#classlevel li:nth-child(" + CatLevel + ")").click();

	$("#Newpayout2 input[name='classout']").siblings(".list").children(".option").hide();
	NewCatType = parseInt(CatType) + 1;
	$("#Newpayout2 input[name='classout']").siblings(".list").children(".option[cattype='" + NewCatType + "']").show();

	if (((CatLevel == 1) && (CatId1 == 0)) || ((CatLevel == 2) && (CatId2 == 0))) {
		//新建分类
		if (CatType == 1) {
			$("#Newpayout2 h1").html("新建收入分类");
		} else {
			$("#Newpayout2 h1").html("新建支出分类");
		}
		if (CatLevel == 1) {
			//显示级别选择
			$("#dHideLevel").hide();
			$("#dHideParent").hide();
			if (CatType == 1) {
				selectOption("#Newpayout2", "classout", 12);
			} else {
				selectOption("#Newpayout2", "classout", 1);
			}
		} else {
			//冻结级别选择
			$("#dHideLevel").show();
			$("#dHideParent").show();
			selectOption("#Newpayout2", "classout", CatId1);
		}
	} else {
		//编辑分类
		//冻结级别选择
		$("#dHideLevel").show();
		$("#dHideParent").hide();
		if (CatType == 1) {
			$("#Newpayout2 h1").html("编辑收入分类");
		} else {
			$("#Newpayout2 h1").html("编辑支出分类");
		}
		if (CatLevel == 1) {
			$("#Newpayout2 input[name='CategoryId']").val(CatId1);
			$("#Newpayout2 input[name='CategoryName']").val($("#tC" + CatType + " tr[mhclass='" + CatId1 + "'][mhparent='0']").attr("catname"));
		} else {
			$("#Newpayout2 input[name='CategoryId']").val(CatId2);
			$("#Newpayout2 input[name='CategoryName']").val($("#tC" + CatType + " tr[mhclass='" + CatId2 + "'][mhparent!='0']").attr("catname"));
			selectOption("#Newpayout2", "classout", CatId1);
		}
	}
}

/** 显示编辑收付款方对话框
 * @param PayeeId 收付款方编号
 */
function editPayee(PayeeId) {
	showAdd("Newsfkf");
	if (PayeeId == 0) {
		currentPayeeEditType = "add";
		$("#Newsfkf h1").html("新建收付款方");
		$("#Newsfkf input").val("");
	} else {
		currentPayeeEditType = "edit";
		$("#Newsfkf h1").html("编辑收付款方");
		$.each(listPayee, function(i, n) {
			if (n.id == PayeeId) {
				$("#Newsfkf input[name='PayeeName']").val(n.Name);
				$("#Newsfkf input[name='PayeeTel']").val(n.tel);
				$("#Newsfkf input[name='PayeeEmail']").val(n.email);
				return false;
			}
		});
	}
	$("#Newsfkf input[name='PayeeId']").val(PayeeId);
}

/** 显示编辑金融机构对话框
 * @param BankType 金融机构类型
 * @param BankId 金融机构编号
 */
function editBank(BankType, BankId) {
	$("#Newscorporation input").val("");

	//编辑时不显示类型框
	if (BankId == 0) {
		currentBankEditType = "add";
		$("#Newscorporation input").val("");
		if (BankType >= 0) {
			$("#Newscorporation input[name='banktype']").parents(".sRDRInput").css("filter", "gray");
			$("#dHideBankType").show();
		} else {
			BankType = 0;
			$("#Newscorporation input[name='banktype']").parents(".sRDRInput").css("filter", "none");
			$("#dHideBankType").hide();
		}
	} else {
		currentBankEditType = "edit";
		//冻结类型选择
		$("#Newscorporation input[name='banktype']").parents(".sRDRInput").css("filter", "gray");
		$("#dHideBankType").show();
	}
	showAdd("Newscorporation");
	selectOption("#Newscorporation", "banktype", BankType);
	if (BankId == 0) {
		//新建一个银行
		$("#Newscorporation h1").html("新建金融机构");
	} else {
		//编辑一个银行
		$("#Newscorporation h1").html("编辑金融机构");
		if (BankType == classBank) list = listBank;
		if (BankType == classFinance) list = listFinance;
		if (BankType == classPay) list = listPay;
		targetRow = $("#tBank tr[bankid='" + BankId + "']");
		$("#Newscorporation input[name='BankName']").val(targetRow.children(".tSRCname").html());
		$("#Newscorporation input[name='BankWebsite']").val(targetRow.children("td:nth-child(3)").html());
	}
	$("#Newscorporation input[name='BankId']").val(BankId);
}

/** 显示删除账户对话框
 * @param tid 主账户类型 
 * @param aid 主账户
 * @param bid 子账户
 */
function showDeleteAccount(tid, aid, bid) {
	if (confirm("将删除所有此账户下的账目，确定要删除吗？")) {
		if (bid == 0) {
			//删除主账户
			handleDeleteAccount(tid, aid, bid);
		} else {
			if ($("#dSetAccount tr[accountid='" + aid + "'][subaccountid!='0']").length <= 1) {
				//只有一个子账户了，需要问用户一下
				if (confirm("删除此子账户后，主账户信息也将一并删除，是否确认？")) {
					handleDeleteAccount(tid, aid, bid);
				}
			} else {
				//有多个子账户，直接删了吧
				handleDeleteAccount(tid, aid, bid);
			}
		}
	}  
}

/** 显示删除分类对话框
 * @param CatType 分类类型，0表示支出，1表示收入
 * @param CatLevel 分类级别
 * @param PayeeId 收付款方编号
 */
function showDeleteCategory(CatType, CatLevel, CatId) {
	showAdd("Delclass");
	$("#Delclass input[name='CategoryType']").val(CatType);
	$("#Delclass input[name='CategoryLevel']").val(CatLevel);
	$("#Delclass input[name='CategoryId']").val(CatId);

	$("#Delclass input[name='category']").siblings(".list").children(".option").hide();
	$("#Delclass input[name='category']").siblings(".list").children(".option[cattype='" + CatType + "']").show();
	//隐藏该分类自身
	if (CatLevel == 1) {
		$("#Delclass input[name='category']").siblings(".list").children("div[parentclass='" + CatId + "']").hide();
	} else {
		$("#Delclass input[name='category']").siblings(".list").children("div[val='" + CatId + "']").hide();
	}
	if (CatLevel == 1) {
		if (CatType == 1) {
			selectOption("#Delclass", "category", 10066);
		} else {
			selectOption("#Delclass", "category", 10065);
		}
	} else {
		//找到它父亲的子分类编号
		parentId = 0;
		parentSubId = 0;
   		$.each(listCategory, function(i, n) {
			if (n.id2 == CatId) {
				parentId = n.id1;
				return false;
			}
		});
   		$.each(listCategory, function(i, n) {
			if (n.id1 == parentId) {
				parentSubId = n.id2;
				return false;
			}
		});
		selectOption("#Delclass", "category", parentSubId);
	}
}

/** 显示删除收付款方对话框
 * @param PayeeId 收付款方编号
 */
function showDeletePayee(PayeeId) {
	$("#Delsfkf input[name='payee']").siblings(".list").children("div").show();
	showAdd("Delsfkf");
	$("#Delsfkf input[name='PayeeId']").val(PayeeId);
	$("#Delsfkf input[name='payee']").siblings(".list").children("div[val='" + PayeeId + "']").hide();
	selectOption("#Delsfkf", "payee", 0);
}

/** 添加子账户
 * @param TypeId 账户类型
 */ 
function handleAddSA(TypeId) {
	var AccountId = $("#newsa" + TypeId + "_form input[name='AccountId']").val();

	if (TypeId < 100) {
		//主账户
		var AccountName = $("#newsa" + TypeId + "_form input[name='AccountName']").val();
		if ((TypeId == 2) || (TypeId == 3) || (TypeId == 4) || (TypeId == 8)) {
			//如果是银行卡或信用卡或支付或者投资，则有机构号
			BankId = $("#newsa" + TypeId + "_form input[name='bank']").val();
		} else {
			BankId = 0;
		}
		//除信用卡和储蓄卡，其余账户皆有一个唯一子账户
		var SubAccountId = 0;
		if ((TypeId != 2) && (TypeId != 3)) {
			SubAccountId = $("#newsa" + TypeId + "_form input[name='SubAccountId']").val();
		}

        var Comment = $("#newsa" + TypeId + "_form textarea[name='description']").val(); 
		if (AccountId == 0) {
			//新建主账户
			//添加进数组
			if (TypeId == 2) {
				//信用卡
				$("#suba2 .dRightTable tr:not(.trNewCreditSub)").each(function () {
					var sign = createTimeRandom();
					var temp = new Array();
					tempCur = $(this).find('#currency').val();
					temp.push(tempCur);
					if ($(this).find("input[name='amount']").val() == "") {
						temp.push("0.00");
					} else {
						temp.push($(this).find("input[name='amount']").val());	
					}
					temp.push("201");
					temp.push("");
					temp.push("");
					//信用卡类型时，子账户名称用币种名称代替
					temp.push(getCurrencyDesc(tempCur));
					temp.push(sign);
					temp.push("");
					subAccount.push(temp);
				});
			}
			//添加进数据库
			AccountId = submitAddAccount(TypeId);
		
			//添加进列表
			if ((TypeId == 2) || (TypeId == 3)) {
				//一个账户可能对应多个子账户的
				content = GenerateAccount(TypeId, 0, AccountId, 0, 1, AccountName, Comment, 1, 0, BankId);
				$("#tAT" + TypeId).append(content);
				$.each(subAccount, function(i, n) {
					if(TypeId == 2){
						content = GenerateAccount(TypeId, subAccount[i][2], AccountId, subAccount[i][6], 0, subAccount[i][5], subAccount[i][7], subAccount[i][0], formatnumber(0 - parseFloat(subAccount[i][1]), 2), 0, subAccount[i][3], subAccount[i][4]);
					}else{
						content = GenerateAccount(TypeId, subAccount[i][2], AccountId, subAccount[i][6], 0, subAccount[i][5], subAccount[i][7], subAccount[i][0], formatnumber(subAccount[i][1], 2), 0, subAccount[i][3], subAccount[i][4]);
					    }
					$("#tAT" + TypeId).append(content);
				});

				//计算主账户总金额
				var totalAmount = 0;
				$("#tAT" + TypeId + " tr[accountid='" + AccountId + "'][subaccountid!='0']").each(function () {
					totalAmount += Math.round(getRMBExchangeInfo2($(this).attr("currency")) * parseFloat($(this).children(".tSRBamount").html())) / 100;
				});
				totalAmount = formatnumber(totalAmount, 2);   
				$("#tAT" + TypeId + " tr[accountid='" + AccountId + "'][subaccountid='0']").children(".tSRBamount").html(totalAmount);
			} else {
				//一个账户只有一个子账户的
				//获取今天的日期
				var a = new Date();
				if ((( a.getMonth() + 1 ) + "").length == 1 )
					month = "0" + ( a.getMonth() + 1 );
				else
					month = a.getMonth() + 1;
				if ((a.getDate() + "").length == 1)
					date = "0" + a.getDate();
				else
					date =  a.getDate();
				transdate = a.getFullYear() + "-" + month + "-" + date;
				var Balance = $("#newsa" + TypeId + "_form input[name='balance']").val();
				var CurrencyId = $("#newsa" + TypeId + "_form input[name='currency']").val();

				//添加一笔调整余额交易
				if (Balance != 0) {
					addTransaction(transdate, 0, 10067, Balance, 0, newSubAccountId, 0, Comment, 0, 2);
				}
				if (TypeId == 7) Balance = -Balance;
				content = GenerateAccount(TypeId, 0, AccountId, 0, 0, AccountName, Comment, CurrencyId, formatnumber(Balance, 2), BankId);//此处需要添加期限和到期日
				$("#tAT" + TypeId).append(content);
			}
			$("#dAT" + TypeId).show();
		} else {
			//编辑主账户
			//更新进数据库
			submitEditAccount(TypeId);
			//编辑提醒事件
			editEvent(TypeId);
			//更新进列表
			if ((TypeId != 2) && (TypeId != 3)) {
				//如果不是信用卡或储蓄卡
				Balance = $("#tAT" + TypeId + " tr[accountid='" + AccountId + "'][subaccountid='" + SubAccountId + "']").children(".tSRBamount").html();
				var CurrencyId = $("#newsa" + TypeId + "_form input[name='currency']").val();
				content = GenerateAccount(TypeId, 0, AccountId, SubAccountId, 0, AccountName, Comment, CurrencyId, Balance, BankId);
			} else {
				//如果是信用卡或储蓄卡
				Balance = $("#tAT" + TypeId + " tr[accountid='" + AccountId + "'][subaccountid='0']").children(".tSRBamount").html();
				content = GenerateAccount(TypeId, 0, AccountId, SubAccountId, 1, AccountName, Comment, 1, Balance, BankId);
			}
			$("#tAT" + TypeId + " tr[accountid='" + AccountId + "'][subaccountid='" + SubAccountId + "']").replaceWith(content);
		}

		//新建子账户按钮
		$(".newsubaccount").unbind("click").click(function(event) {
			event.stopPropagation();
			if ($(this).attr("atid") == 2) {
				//显示信用卡子账户窗口
				AddSA(201, $(this).parents(".tSRBrow").attr('accountid'), 0);
			} else {
				//显示借记卡子账户窗口
				$(".tSRSubaccount").find("li").attr("accountid", $(this).parents(".tSRBrow").attr("accountid"));
				$(".tSRSubaccount").css("top", $(this).offset().top + 20);								   
				$(".tSRSubaccount").toggle();
			}								   
		});
	} else {
		//子账户
		var SubAccountId = $("#newsa" + TypeId + "_form input[name='SubAccountId']").val();
		if (SubAccountId == 0) {
			//新建子账户
			if (TypeId == 201) AccountType = 2;
			else AccountType = 3;
			//添加进数组
			var SubAccountInfo = addSubAccount(AccountType, TypeId);
			viewAddSubAccount(AccountType);
			//添加进数据库
			result = addAccountSub(AccountId, SubAccountInfo[0], SubAccountInfo[1], SubAccountInfo[1], SubAccountInfo[3], SubAccountInfo[4], SubAccountInfo[2], SubAccountInfo[5], SubAccountInfo[7]);
			//101, 102定期、理财提醒事件
			if (AccountType == 3) {
	            var name = $("#newsa3 input[name = 'AccountName']").val();
				var subName = $("#newsa" + TypeId + " input[name = 'subName']").val();
				var enddate = $("#newsa" + TypeId + " input[name = 'sdate']").val();
				if ($("#newsa" + TypeId + " .sCheckBox").hasClass("sCheckBox2") == true && enddate != ""){
				    var alarm = $("#newsa" + TypeId + " span[id = 'rmday']").text();
				    var result = addInvestEvent(name, subName, enddate, alarm);
				}
			}
			//添加进列表
			content = GenerateAccount(AccountType, SubAccountInfo[2], AccountId, result, 0, SubAccountInfo[5], SubAccountInfo[7], SubAccountInfo[0], SubAccountInfo[1], 0, SubAccountInfo[3], SubAccountInfo[4]);
			$("#tAT" + AccountType + " tr[accountid = '" + AccountId + "']").last().after(content);
		} else {
			//编辑子账户
			if (TypeId == 201) AccountType = 2;
			else AccountType = 3;
			//编辑提醒事件
			editEvent(TypeId);
			//更新进数据库
			var subPosition = 0;
			for (i=0; i<subAccount.length; i++) {
				if (subAccount[i][6] == SubAccountId) {
					subPosition = i;
				}
			}
			var SubAccountInfo = addSubAccount(AccountType, TypeId);
			subAccount.pop();
			subAccount.splice(subPosition, 1, SubAccountInfo);
			viewAddSubAccount(AccountType);
			result = editAccountSub(SubAccountId, SubAccountInfo[3], SubAccountInfo[4], SubAccountInfo[2], SubAccountInfo[5], SubAccountInfo[7], AccountType);
			//更新进列表
			Balance = $("#tAT" + AccountType + " tr[accountid='" + AccountId + "'][subaccountid='" + SubAccountId + "']").children(".tSRBamount").html();
			content = GenerateAccount(AccountType, SubAccountInfo[2], AccountId, SubAccountId, 0, SubAccountInfo[5], SubAccountInfo[7], SubAccountInfo[0], Balance, 0, SubAccountInfo[3], SubAccountInfo[4]);
			$("#tAT" + AccountType + " tr[accountid = '" + AccountId + "'][subaccountid = '" + SubAccountId + "']").replaceWith(content);
		}
	}

	//点击三角时的动作	
	$(".iTree").unbind().toggle(function() {
		var myTR = $(this).parents(".tSRBrow");
		$(this).attr("src", "../images/tree2.gif");
		myTR.siblings("tr[mhparent='" + myTR.attr("mhclass") + "']").hide();
		myTR.siblings("tr[accountid='" + myTR.attr("accountid") + "'][subaccountid!='0']").hide();
	}, function() {
		var myTR = $(this).parents(".tSRBrow");
		$(this).attr("src", "../images/tree1.gif");
		myTR.siblings("tr[mhparent='" + myTR.attr("mhclass") + "']").show();
		myTR.siblings("tr[accountid='" + myTR.attr("accountid") + "'][subaccountid!='0']").show();
	});
	
	//通知记账页
	try {
		window.external.SetParameter("AccountChanged", "1");
	} catch (e) {
	}
	adjustAccountWidth();
}

/** 处理添加或编辑分类
 */
function handleAddMyCategory() {
	var CategoryId = $("#Newpayout2_form input[name='CategoryId']").val();
	var CategoryName = $("#Newpayout2_form input[name='CategoryName']").val();
	var CategoryType = $("#Newpayout2_form input[name='CategoryType']").val();
	var CategoryLevel = $("#Newpayout2_form input[name='CategoryLevel']").val();
	content = "";
	var id2 = 0;
	if (CategoryId != 0) {
		//编辑态
		//更新数组
		if (CategoryLevel == 1) {
			//更新一级分类
			//更新数据库
			updateCategory(CategoryLevel, CategoryName, CategoryId);
			//更新列表
			content = GenerateCategory(CategoryType, CategoryId, 0, CategoryName, "CATA420");
			$("#tC" + CategoryType + " tr[mhclass='" + CategoryId + "'][mhparent='0']").replaceWith(content);
		} else {
			//更新二级分类
			var NewParent = $("#Newpayout2_form input[name='classout']").val();
			//更新数据库
			updateCategory(CategoryLevel, CategoryName, CategoryId, NewParent);
			//更新列表
			content = GenerateCategory(CategoryType, NewParent, CategoryId, "", CategoryName);
			$("#tC" + CategoryType + " tr[mhclass='" + CategoryId + "'][mhparent!='0']").remove();
			$("#tC" + CategoryType + " tr[mhclass='" + NewParent + "'][mhparent='0']").after(content);
		}
	} else {
		//新建态
		if (CategoryLevel == 1) {
			//添加一级分类
			//添加到数据库中
			var id1 = addCategory1(CategoryName, CategoryType);
			if (id1) {
				//添加成功
				//开始添加二级分类
				id2 = addCategory2(id1, "CATA420");
				//添加到列表中
				content = GenerateCategory(CategoryType, id1, id2, CategoryName, "CATA420");
				$("#tC" + CategoryType).append(content);
				//添加到下拉框中
				NewCategoryType = parseInt(CategoryType) + 1;
				addOption("#Newpayout2", "classout", id1, CategoryName, "cattype=" + NewCategoryType);
				addOption("#Delclass", "category", id2, CategoryName, "cattype=" + CategoryType + " parentclass='0' mhvalue='" + CategoryName + "'", " firstCat");
			}
		} else {
			//添加二级分类
			var id1 = $("#Newpayout2_form input[name='classout']").val();
			//添加到数据库中
			id2 = addCategory2(id1, CategoryName);
			//添加到列表中
			content = GenerateCategory(CategoryType, id1, id2, "", CategoryName);
			if ($("#tC" + CategoryType + " tr[mhparent='" + id1 + "']").length > 0) {
				$("#tC" + CategoryType + " tr[mhparent='" + id1 + "']").last().after(content);
			} else {
				$("#tC" + CategoryType + " tr[mhclass='" + id1 + "'][mhparent='0']").after(content);
			}
		}
	}
	adjustPayWidth();
	try {
		window.external.SetParameter("CategoryChanged", "" + id2);
	} catch (e) {
	}
	if (showAddCategory != "-1") {
		//从哪儿来的，回哪儿去
		window.open('index.html');
	}
}

/** 添加,编辑收付款方事件
 */
function handleAddMyPayee() {
	var payeeId = $("input[name='PayeeId']").val();
	var newPayee = $("input[name='PayeeName']").val();
	var payeeMail = $("input[name='PayeeEmail']").val();
	var payeeTel = $("input[name='PayeeTel']").val();
	if (payeeId != 0) {
		//编辑态
		updatePayee(payeeId, newPayee, payeeMail, payeeTel);
		content = GeneratePayee(payeeId, newPayee, payeeTel, payeeMail);
		$("#tPayee tr[payeeid='" + payeeId + "']").replaceWith(content);
	} else {
		//新建态
		//添加到数据库中
		payeeId = addNewPayee(newPayee, payeeMail, payeeTel);
		//添加到列表中
		content = GeneratePayee(payeeId, newPayee, payeeTel, payeeMail);
		if ($("#tPayee tr").length == 1) {
			$("#tPayee").append(content);
		} else {
			newPayeePinyin = getGB2312Spell(newPayee);
			var foundPosition = false;
			$("#tPayee tr").each(function () {
				if (newPayeePinyin < $(this).attr("payeepinyin")) {
					$(this).before(content);
					foundPosition = true;
					return false;
				}
			});
			if (!foundPosition) $("#tPayee").append(content);	
		}
		//添加到下拉框中
		addOption("#Delsfkf", "payee", payeeId, newPayee.replace(/&/g,"&amp;"), "", "");
	}
	try {
		window.external.SetParameter("PayeeChanged", "" + payeeId);
	} catch (e) {
	}
	if (showAddPayee != "-1") {
		//从哪儿来的，回哪儿去
		window.open('index.html');
	}
}

/** 添加,编辑金融机构事件
 */
function handleAddMyBank() {
	var BankId = $("input[name='BankId']").val();
	var BankName = $("input[name='BankName']").val();
	var BankWebsite = $("input[name='BankWebsite']").val();
	var BankType = $("input[name='banktype']").val();
	if (BankType == classBank) list = listBank;
	if (BankType == classFinance) list = listFinance;
	if (BankType == classPay) list = listPay;
	if (BankId != 0) {
		//编辑态
		//更新数据库
		updateBank(BankId, BankName, BankWebsite);
		//更新数组
		$.each(list, function(i, n) {
			if (n.id == BankId) {
				list.splice(i, 1, {
		            "id": BankId,
					"name": BankName,
		            "Website": BankWebsite,
					"classId": BankType
				});
				return false;
			}
		});
		//更新列表
		content = GenerateBank(BankId, BankName, BankType, BankWebsite);
		if(list.length == 0){
			$("#list").append(content);
		}
		else{
		 	$("#tBank tr[bankid='" + BankId + "']").replaceWith(content);
		}
		//更新到下拉框中
		if (BankType == classBank) {
			editOption("#newsa2", "bank", BankId, BankName);
			editOption("#newsa3", "bank", BankId, BankName);
		} else if (BankType == classPay) {
			editOption("#newsa4", "bank", BankId, BankName);
		} else {
			editOption("#newsa8", "bank", BankId, BankName);
		}
	} else {
		//新建态
		//添加到数据库中
		BankId = insertBank(BankName, BankType,BankWebsite);
		//添加到数组中
		/*list.push({
            "id": BankId,
			"name": BankName,
            "Website": BankWebsite,
			"classId": BankType
		});*/
		//添加到列表中
		content = GenerateBank(BankId, BankName, BankType, BankWebsite);
		if ($("#tBank tr").length == 1){
			$("#tBank").append(content);
		}
		else{
			foundPosition = false;
			NewBankNamePinyin = getGB2312Spell(BankName);
			if (BankType == 0){
				$("#tBank tr").each(function(){
											if (NewBankNamePinyin < $(this).attr("BankNamePinyin") && BankType == $(this).attr("banktype1")){
											foundPosition = true;
											$(this).before(content);
											return false;
											}else if ($(this).attr("banktype1") == 2){
												  foundPosition = true;
												  $(this).before(content);
												  return false;
												  }else if ($(this).attr("banktype1") == 1){
												  		  foundPosition = true;
														  $(this).before(content);
												  		return false;
														 }														
				});
				if (foundPosition == false){$("#tBank").append(content);}
			}
			
			if (BankType == 2){
				$("#tBank tr").each(function(){
											if (NewBankNamePinyin < $(this).attr("BankNamePinyin") && BankType == $(this).attr("banktype1")){
											foundPosition = true;
											$(this).before(content);
											return false;
											}else if ($(this).attr("banktype1") == 1){
												  		  foundPosition = true;
														  $(this).before(content);
												  		return false;
														 }														
				});
				if (foundPosition == false){$("#tBank").append(content);}
			}
			
			if (BankType == 1){
				$("#tBank tr").each(function(){
											if (NewBankNamePinyin < $(this).attr("BankNamePinyin") && BankType == $(this).attr("banktype1")){
											foundPosition = true;
											$(this).before(content);
											return false;
											}														
				});
				if (foundPosition == false){$("#tBank").append(content);}
			}      
		}
		//$("#tBank").append(content);
		//添加到下拉框中
		if (BankType == classBank) {
			addOption("#newsa2", "bank", BankId, BankName);
			addOption("#newsa3", "bank", BankId, BankName);
		} else if (BankType == classPay) {
			addOption("#newsa4", "bank", BankId, BankName);
		} else {
			addOption("#newsa8", "bank", BankId, BankName);
		}
	}
}

/** 删除账户
 * @param tid 主账户类型 
 * @param aid 主账户
 * @param bid 子账户
 */
function handleDeleteAccount(tid, aid, bid) {
	if (bid == 0) {
		//删除主账户
		//删除数组中该项
		$.each(listAccount, function(i, n) {
			if ((n != undefined) && (n.aid == aid)) {
				listAccount.splice(i, 1);
				var eventDescription = (n.aname + " " + n.bname + "到期").replace(/^\s+(.*?)\s+$/, "$1");
				deleteEventByName(eventDescription);
			}
		});
		//从列表中删除
		$("#tAT" + tid + " tr[accountid='" + aid + "']").remove();
		var name = $("#tAT" + tid + " tr[accountid='" + aid + "']").attr("accountname");
		if (tid == 8){//删除提醒事件
		    var eventDescription = (name + " " + "" + "到期").replace(/^\s+(.*?)\s+$/, "$1");
			deleteEventByName(eventDescription);
		}else if (tid == 3 || tid == 2) {
		    try{
			    window.external.ExecuteSQL("delete from tbEvent where description like '%" + name + "%'");
			}catch(e){
			  //TODO
			}
		}
		//$("#tAT" + tid + " tr[accountid='" + aid + "']").remove();
		//从数据库中删除
		deleteAccount(aid);
	} else {
		//删除子账户
		//删除数组中该项
		$.each(listAccount, function(i, n) {
			if (n.bid == bid) {
				listAccount.splice(i, 1);
				return false;
			}
		});
		//从列表中删除
		$("#tAT" + tid + " tr[subaccountid='" + bid + "'][accountid='" + aid + "']").remove();
		if ($("#tAT" + tid + " tr[subaccountid!='0'][accountid='" + aid + "']").length == 0) {
			$("#tAT" + tid + " tr[subaccountid='0'][accountid='" + aid + "']").remove();
		}
		var name = $("#tAT" + tid + " tr[accountid='" + aid + "']").attr("accountname");
		var subName = $("#tAT" + tid + " tr[subaccountid='" + bid + "']").attr("accountname");
		if (tid == 3){
		    var eventDescription = (name + " " + subName + "到期").replace(/^\s+(.*?)\s+$/, "$1");
		    deleteEventByName(eventDescription);
		}else if (tid == 2){
		    try{
			    window.external.ExecuteSQL("delete from tbEvent where description like '%" + name + "%'");
			}catch(e){
			  //TODO
			}
		}
		//从数据库中删除
		deleteSubAccount(aid, bid);
	}
	if ($("#tAT" + tid + " tr").length <= 0) $("#dAT" + tid).hide();
	//通知记账页
	try {
		window.external.SetParameter("AccountChanged", "1");
	} catch (e) {
	}
}

/** 删除分类
 */
function handleDeleteMyCategory() {
	var CategoryType = $("#Delclass_form input[name='CategoryType']").val();
	var CategoryLevel = $("#Delclass_form input[name='CategoryLevel']").val();
	var CategoryId = $("#Delclass_form input[name='CategoryId']").val();

	if ($("#Delclass_form .radio").attr("status") == 0) {
		//替换分类为
		var newCategory = $("#Delclass_form input[name='category']").val();
		try {
			if (CategoryLevel == 1) {
				window.external.ExecuteSQL("UPDATE tbTransaction SET tbCategory2_id=" + newCategory + " WHERE tbCategory2_id IN (SELECT id FROM tbCategory2 WHERE tbcategory1_id=" + CategoryId + ")");
			} else {
				window.external.ExecuteSQL("UPDATE tbTransaction SET tbCategory2_id=" + newCategory + " WHERE tbCategory2_id=" + CategoryId);
			}
		} catch (e) {
		}
	} else {
		//删除所有与此分类相关联的交易
        var lSubAccount = "";
		try {
			if (CategoryLevel == 1) {
				//找出所有与此分类相关联的子账户
		        lSubAccount = JSON.parse(window.external.QuerySQL("SELECT DISTINCT tbSubAccount_id AS id FROM tbTransaction WHERE tbCategory2_id IN (SELECT id FROM tbCategory2 WHERE tbcategory1_id=" + CategoryId + ")"));
				window.external.ExecuteSQL("DELETE FROM tbTransaction WHERE tbCategory2_id IN (SELECT id FROM tbCategory2 WHERE tbcategory1_id=" + CategoryId + ")");
			} else {
		        lSubAccount = JSON.parse(window.external.QuerySQL("SELECT DISTINCT tbSubAccount_id AS id FROM tbTransaction WHERE tbCategory2_id=" + CategoryId));
				window.external.ExecuteSQL("DELETE FROM tbTransaction WHERE tbCategory2_id=" + CategoryId);
			}
		} catch (e) {
		}
		//计算被删除的分类所关联的子账户的余额
		$.each(lSubAccount, function(i, n) {
			modifySubAccountBalance(n.id);
		});
	}

	//删除下拉框中的该选项
	if (CategoryLevel == 1) {
		$("#Newpayout2 input[name='classout']").siblings(".list").children("div[val='" + CategoryId + "']").remove();
		$("#Delclass_form input[name='category']").siblings(".list").children("div[parentclass='" + CategoryId + "']").remove();
	} else {
		$("#Delclass_form input[name='category']").siblings(".list").children("div[val='" + CategoryId + "']").remove();
	}
	//删除数组中该项
	$.each(listCategory, function(i, n) {
		if (CategoryLevel == 1) {
			if (n.id1 == CategoryId) {
				listCategory.splice(i, 1);
			}
		} else {
			if (n.id2 == CategoryId) {
				listCategory.splice(i, 1);
				return false;
			}
		}
	});
	//从列表中删除
	if (CategoryLevel == 1) {
		$("#tC" + CategoryType + " tr[mhclass='" + CategoryId + "'][mhparent='0']").remove();
		$("#tC" + CategoryType + " tr[mhparent='" + CategoryId + "']").remove();
	} else {
		$("#tC" + CategoryType + " tr[mhclass='" + CategoryId + "'][mhparent!='0']").remove();
	}
	//从数据库中删除
	deleteCategory(CategoryLevel, CategoryId);
	
	//通知记账页
	try {
		window.external.SetParameter("CategoryChanged", "1");
	} catch (e) {
	}
}

/** 删除支付对象
 */
function handleDeleteMyPayee() {
	var payeeId = $("#Delsfkf_form input[name='PayeeId']").val();
	if ($("#Delsfkf_form .radio").attr("status") == 0) {
		//替换收付款人为
		var newPayee = $("#Delsfkf_form input[name='payee']").val();
		try {
			window.external.ExecuteSQL("UPDATE tbTransaction SET tbPayee_id=" + newPayee + " WHERE tbPayee_id=" + payeeId);
		} catch (e) {
		}
	} else {
		//删除所有与此收付款人相关联的交易
		try {
			window.external.ExecuteSQL("DELETE FROM tbTransaction WHERE tbPayee_id=" + payeeId)
		} catch (e) {
		}
		$("#dSetAccount tr[subaccountid!=0]").each(function () {
			modifySubAccountBalance($(this).attr("subaccountid"));
		});
	}
	//删除下拉框中的该选项
	$("#payee").siblings(".list").children("div[val='" + payeeId + "']").remove();
	//删除数组中该项
	$.each(listPayee, function(i, n) {
		if (n.id == payeeId) {
			listPayee.splice(i, 1);
			return false;
		}
	});
	//从列表中删除
	$("#tPayee tr[payeeid='" + payeeId + "']").remove();
	//从数据库中删除
	deletePayee(payeeId);

	//通知记账页
	try {
		window.external.SetParameter("PayeeChanged", "1");
	} catch (e) {
	}
}

/** 删除金融机构
 * @param BankType 金融机构类型
 * @param BankId 金融机构编号
 */
function handleDeleteBank(BankType, BankId) {
	if ($("#dSetAccount tr[bankid='" + BankId + "']").length > 0) {
		alert("此金融机构已与账户关联，不可删除");
	} else {
		if (confirm("将删除此金融机构，确定要删除吗?")){
			//删除下拉框中的该选项
			$(".addBox input[name='bank']").siblings(".list").children("div[val='" + BankId + "']").remove();
			//从列表中删除
			$("#tBank tr[bankid='" + BankId + "']").remove();
			//从数据库中删除
			deleteBank(BankId);
		}
	}
}

/** 处理子账户的显示区
 * @param id 主账户类型
 */
function viewAddSubAccount(id) {
	//渲染子账户列表
	renderSubAccountView(id);
	//renderEditArea("add", id, "");

	//创建自定义select
	//customizeSelect();
}

/** 取得截止期限内容
 * @id 编号
 */
function getDuringDesc(id) {
	var result = "";
	$.each(duringData, function(i, n) {
		if(id == n.id) {
			result = n.Name;
		}
	});
	return result;
}

/** 根据数据生成子账户列表区
 * @param id 主账户类型
 */
function renderSubAccountView(id){
	if (id == 2) {
		//信用卡
		$("#suba2 .dRTTable tr").html("<td>币种</td><td>初始欠款</td><td>&nbsp;</td>");
		$("#suba2 .dRightTable").html("<tr class='trNewCreditSub'><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>");
		$("#suba2 .trNewCreditSub").click(function () {
			if ($("#suba2 tr").length < 8) {
				content = '<tr mhcontent="true"><td width="170"><div><select name="currency"></select></div></td>'
					+ '<td width="90"><div class="selectCurrency"><div class="dRDRInput"><input type="text" name="amount" value="0.00"/></div></div></td>'
					+ '<td class="tSRCfunction"><div class="dFunction">'
					+ '<img class="delete" width="12" height="11" onclick="$(this).parents(\'tr\').remove();$(\'#suba2 .trNewCreditSub\').show();" src="images/delete.gif" alt="删除">'
					+ '</div></td></tr>';
				content = $(content);
				$(this).before(content);
				//设置币种下拉框
				$.each(listCurrency, function(i, n) {
					content.find("select[name='currency']").append("<option value='" + n.id + "'>" + n.Name + "</option>");		
				});
				content.find("input[name='amount']").focusout(function () {
					if (isNaN(parseFloat($(this).val())) || !isFinite($(this).val())) {
						alert("初始欠款输入有误！");
						//$(this).click();
					}
				});
				customizeSelect("#suba2");
			}
			if ($("#suba2 tr").length == 8) {
				$("#suba2 .trNewCreditSub").hide();
			}
		});
		$("#suba2 .trNewCreditSub").click();
		$("#suba2 .dRightTable").append(generateEmptyLines("#main .dRightTable", 2, "renderEditArea(\"add\", " + id + ", -1);customizeSelect();"));

		$("#suba2 .dRTTable td:nth-child(1)").width(170);
		$("#suba2 .dRTTable td:nth-child(2)").width(90);
		$("#suba2 .dRightTable td:nth-child(1)").width(170);
		$("#suba2 .dRightTable td:nth-child(2)").width(90);
	} else if (id == 3) {
		//储蓄卡/存折
		desc = "";
		$("#suba3 .dRTTable tr").html("<td>名称</td><td>类型</td><td class='tSRCEdit'>&nbsp;</td><td>&nbsp;</td>");
		if (subAccount != null || subAccount != "") {
			trClass = "tDetail1";
			for (var i=0; i<subAccount.length; i++) {
				desc += "<tr mhcontent='true' class='" + trClass + "' id='tr" + subAccount[i][6] + "' satype='" + subAccount[i][2] + "' subaccountid='" + subAccount[i][6]
					+ "' accountname='" + subAccount[i][5] + "' days='" + subAccount[i][3] + "' enddate='" + subAccount[i][4] + "' comment='" + subAccount[i][7]
					+ "' balance='" + subAccount[i][1] + "' currency='" + subAccount[i][0] + "'>";
				desc += "<td><nobr>" + replaceHtmlStr(subAccount[i][5]) + "</nobr></td>";
				desc += "<td><nobr>" + listSubAccount[subAccount[i][2]] + "</nobr></td>";
				desc += '<td class="tSRCEdit"><img class="edit" width="11" height="11" onclick="AddSA($(this).parents(\'tr\').attr(\'satype\'), 0, $(this).parents(\'tr\').attr(\'subaccountid\'), 1)" src="images/edit.gif" alt="编辑"></td>'
					+ '<td class="tSRCDelete"><img class="delete" width="12" height="11" onclick="$(this).parents(\'tr\').remove(); subAccount.splice(' + i + ', 1);" src="images/delete.gif" alt="删除"></td>';
				desc += "</tr>";
				if (trClass == "tDetail1") trClass = "tDetail2";
				else trClass = "tDetail1";
			}
		}
		$("#suba3 .dRightTable").html(desc);
		$("#suba3 .dRightTable").append(generateEmptyLines("#suba3 .dRightTable", 4, ""));
		$("#suba3 .dRTTable td:nth-child(1)").width(195);
		$("#suba3 .dRTTable td:nth-child(2)").width(100);
		$("#suba3 .dRTTable td:nth-child(3)").width(30);
		$("#suba3 .dRTTable td:nth-child(3)").css("border-right", "none");
		$("#suba3 .dRTTable td:nth-child(4)").css("border-left", "none");
		$("#suba3 .dRightTable td:nth-child(1)").width(195);
		$("#suba3 .dRightTable td:nth-child(2)").width(100);
		$("#suba3 .dRightTable td:nth-child(3)").width(30);
		$("#suba3 .dRightTable td:nth-child(3)").css("border-right", "none");
	}
}

/** 根据当前时间生成随机数
 * @return 随机数
 */ 
function createTimeRandom() {
	var date = new Date();
	var yy = date.getYear();
	var MM = date.getMonth() + 1;
	var dd = date.getDay();
	var hh = date.getHours();
	var mm = date.getMinutes();
	var ss = date.getSeconds();
	var sss = date.getMilliseconds();
	var result = Date.UTC(yy, MM, dd, hh, mm, ss, sss);
	return result;
}

/** 添加银行卡子账户响应事件
 * @param id 主账户类型
 * @param sid 子账户类型
 * @return 子账户信息数组  
 */
function addSubAccount(id, sid) {
	var sign = createTimeRandom();
	var temp = new Array();
	var tempCur = $('#newsa' + sid + ' input[name="currency"]').val();
	temp.push($('#newsa' + sid + ' input[name="currency"]').val());
	temp.push($('#newsa' + sid + ' input[name="balance"]').val());
	temp.push(sid);
	if (sid == 100) {
		//活期存款不记录
		temp.push("");
		temp.push("");
	} else {
		temp.push($('#newsa' + sid + ' input[name="during"]').val());
		temp.push($('#newsa' + sid + ' input[name="enddate"]').val());
	}
	if (sid == 201) {
		//信用卡子账户以币种命名
		temp.push($('#newsa' + sid + ' input[name="currency"]').siblings(".label").html());
	} else {
		temp.push($('#newsa' + sid + ' input[name="subName"]').val());
	}
	temp.push(sign);
	temp.push($('#newsa' + sid + ' textarea[name="description"]').val());
	//更新数据
	subAccount.push(temp);
	return temp;
}

/** 根据主图层名称和编辑状态处理对话框底部按钮的事件
 * @param dialogName 对话框ID
 */
function changeButton(dialogName) {
	var BoxName = "#" + dialogName + "boxBg";
	$(BoxName + ' .boxBg8 .oplist').html("<li><span class='yes_btn'></span></li><li><span class='cancel_btn'></span></li>");
	switch (dialogName) {
		case "suba2": case "suba3":
			//信用卡和储蓄卡子账户窗口有两个按钮：上一步，完成
			$(BoxName + ' .boxBg8 .oplist').html("<li><span class='prev_btn'></span></li><li><span class='finish_btn'></span></li>");
			$(BoxName + ' .boxBg8 .oplist .prev_btn').unbind().click(function () {
				$("#" + dialogName).parent().hide();
				showAdd("newsa" + dialogName.substr(4), 1);
			});
			$(BoxName + ' .boxBg8 .oplist .finish_btn').unbind().click(function() {
				if (myFormValidate('#' + dialogName + '_form')) {
					eval($('#' + dialogName + '_form').attr('function'));
					cancelAdd(dialogName);
				};
			});
			break;

		case "addMyBank":
			$('#addMyBankboxBg .boxBg8 .oplist .del_btn').parent().hide();
			break;
			
		default :
			break;
	}

	$(BoxName + ' .yes_btn').unbind().click( function(){
		if (myFormValidate('#' + dialogName + '_form')) {
			eval($('#' + dialogName + '_form').attr('function'));
			cancelAdd(dialogName);
		};
	});
	$(BoxName + " .cancel_btn").unbind("click").click(function () {
		cancelAdd(dialogName);
	});
}

/** 数据校验事件
 * @param divId 图层号
 * @return 1表示校验成功，0表示校验失败 
 */
function myFormValidate(divId) {
	var validator = "";
	var valResult = 0;

	//建立验证
	validator = $(divId).validate({
		errorPlacement: function(error, element) {
			element.parents(".dRDRField").children(".dValidation").html(error);
			element.parents(".dEAItem").children(".dValidation").html(error);
		}
	});
	
	//取数字的前两位小数点
	$(divId + " .iMoney").each(function() {
		var numberBeforePoint = 0;
		if ($(this).val().indexOf(".") != -1) {
			numberBeforePoint = $(this).val().substring(0, $(this).val().indexOf("."));
		} else {
			numberBeforePoint = $(this).val();
		}
		if (numberBeforePoint.length <= 14) {
			if (!isNaN($(this).val() * 100)) {
				$(this).val(Math.floor($(this).val() * 100) / 100);
			}
		}
	});

	//执行验证
	switch (divId) {
		case "#suba3_form": case "#suba2_form":
			if (validator.form()) {
				if ($(divId + " .dRightTable tr[mhcontent='true']").length < 1) {    
					alert("该账户下未建立任何币种的子账户，不允许提交。请至少建立一个子账户。");
					return 0;
				} else {
					if (divId == "#suba2_form") {
						aCurrency = new Array();
						var i = 0;
						$(divId + " .dRightTable input[name='currency']").each(function () {
							aCurrency[i] = $(this).val();
							i++;
						});
						var sorted_arr = aCurrency.sort();
						var results = false;
						for (i = 0; i < aCurrency.length - 1; i += 1) {
							if (sorted_arr[i + 1] == sorted_arr[i]) {
								results = true;
							}
						}
						if (results) {
							alert("该账户下不能有同币种的子账户。");
							return 0;
						} else {
							return 1;
						}
					} else {
						return 1;
					}
				}
			}
			break;
			
		case "#newsa201_form":
			subAccountName = $(divId + ' input[name="currency"]').siblings(".label").html();
			AccountId = $(divId + ' input[name="AccountId"]').val();
			foundSame = false;
			$("#tAT2 tr[accountid=" + AccountId + "][subaccountid!=0]").find(".dSRBname2").each(function () {
				if ($(this).children("nobr").html() == subAccountName) {
					foundSame = true;
				}
			});
			if (foundSame) {
				alert("该账户下不能有同币种的子账户。");
				return 0;
			} else {
				return 1;
			}
			break;
			
		default:
			if (validator.form()) {
				valResult = 1;
			}
			break;
	}
	return valResult;
}

/** 建立主账户
 * @param TypeId 主账户类型
 * @return 主账户编号 
 */
function submitAddAccount(TypeId) {
	var name, accountTypeId, bankId, content, tbCurrency_id, openbalance, balance, days, enddate, tbAccountType_id, subName;

	name = $("#newsa" + TypeId + " input[name='AccountName']").length > 0 ? $("#newsa" + TypeId + " input[name='AccountName']").val() : "";
	bankId = $("#newsa" + TypeId + " input[name='bank']").length > 0 ? $("#newsa" + TypeId + " input[name='bank']").val() : "";
	tbCurrency_id = $("#newsa" + TypeId + " input[name='currency']").val() != "" ? $("#newsa" + TypeId + " input[name='currency']").val() : "1";
	balance = $("#newsa" + TypeId + " input[name='balance']").length > 0 ? $("#newsa" + TypeId + " input[name='balance']").val() : "";
	days = $("#newsa" + TypeId + " input[name='during']").length > 0 ? $("#newsa" + TypeId + " input[name='during']").val() : "";
	enddate = $("#newsa" + TypeId + " input[name='sdate']").length > 0 ? $("#newsa" + TypeId + " input[name='sdate']").val() : "";
	content = $("#newsa" + TypeId + " textarea[name='description']").val();
	openbalance = balance;
	
	//添加提醒事件
	if (TypeId == 8){
		//添加投资到期日提醒事件
		if ($("#newsa8 .sCheckBox").hasClass("sCheckBox2") == true && enddate != ""){
		
			var alarm = $("#newsa8 span[id='rmday']").text();
			var result = addInvestEvent(name, "", enddate, alarm);//插入日期提醒事件	
		}
	}else if (TypeId == 2) {
	    var date = new Date();
	    var year = date.getFullYear(),
		    month = (date.getMonth() + 1 >= 10) ? date.getMonth() + 1 : "0" + (date.getMonth() + 1),
	        billdate = year + "-" + month + "-" + $("#newsa2 input[name='billdate']").val(),//账单日
            returndate = year  + "-" + month + "-" + $("#newsa2 input[name='returndate']").val();//还款日		
		subName = $("#suba2_form .label").text();
		if ($("#newsa2 span[id='zddate']").hasClass("sCheckBox2") == true && billdate != ""){
		    var alarm1 = $("#endDay-zd span[id = 'rmday']").text();
			var result = addInvestEvent(name, subName + "账单日\t", billdate, alarm1);//插入账单日日期提醒事件	
		}
		if ($("#newsa2 span[id='zhkdate']").hasClass("sCheckBox2") == true && returndate != ""){
		    var alarm2 = $("#endDay-zhk span[id = 'rmday']").text();
			var result = addInvestEvent(name, subName + "还款日\t\t", returndate, alarm2);//插入还款日日期提醒事件	
		}
	}

	//赋值结束，执行添加方法
	return addNewAccount(name, TypeId, bankId, content, tbCurrency_id, openbalance, balance, days, enddate);
}

/** 实现添加账户功能
 * @param name 账户名称
 * @param accountTypeId 账户类型
 * @param bankId 银行
 * @param content 备注
 * @param tbCurrency_id 币种信息
 * @param openbalance 初始余额
 * @param balance 余额
 * @param days 期限
 * @param enddate 到期日
 * @return 主账户编号 
 */
function addNewAccount(name, accountTypeId, bankId, content, tbCurrency_id, openbalance, balance, days, enddate) {
	//先创建主账户
	var accountId = addAccount(name, accountTypeId, bankId, content);
	if (accountId > 0) {
		//主账户插入成功，处理子账户
		if ((accountTypeId == 2) || (accountTypeId == 3)) {
			//一个账户可能对应多个子账户的
			var subLength = subAccount.length;
			var result = -1;
			for (var i=0; i<subLength; i++) {
				if (accountTypeId == 2) {
					result = addAccountSub(accountId, subAccount[i][0], 0-subAccount[i][1], 0-subAccount[i][1], subAccount[i][3], subAccount[i][4], subAccount[i][2], subAccount[i][5], subAccount[i][7]);
				} else {
					result = addAccountSub(accountId, subAccount[i][0], subAccount[i][1], subAccount[i][1], subAccount[i][3], subAccount[i][4], subAccount[i][2], subAccount[i][5], subAccount[i][7]);
				}
				subAccount[i][6] = result;	
				
				if (result <= 0) {
					break;
				}

				//添加到数组中
				listAccount.push({
					"aname": name,
					"bname": subAccount[i][5],
					"aid": accountId,
					"bid": result,
					"tid": accountTypeId,
					"tid2": subAccount[i][2],
					"tbBank_id": bankId
				});
			}
		} else {
			//一个账户对应一个子账户的
			if (accountTypeId == 7) {
				//如果是信用卡和借入的钱，取负值
				balance = 0 - balance;
				openbalance = balance;
			}
			newSubAccountId = addAccountSub(accountId, tbCurrency_id, openbalance, balance, days, enddate, "", "", "");
			
			//添加到数组中
			listAccount.push({
				"aname": name,
				"bname": "",
				"aid": accountId,
				"bid": 0,
				"tid": accountTypeId,
				"tid2": 0,
				"tbBank_id": bankId
			});
		}
	} else {
		//主账户插入失败
	}

	//清空subAccount数据
	//subAccount = [];
	return accountId;
}

/** 实现编辑账户功能
 * @param TypeId 主账户类型
 */
function submitEditAccount(TypeId) {
	//赋值
	var name, accountTypeId, bankId, content, tbCurrency_id, openbalance, balance, days, enddate, tbAccountType_id, subName, accountId, alarm;
	if ($("#newsa" + TypeId + " input[name='AccountName']").length > 0)
		name = $("#newsa" + TypeId + " input[name='AccountName']").val();
	else
		name = "";

	accountId = $("#newsa" + TypeId + " input[name='AccountId']").val();

	content = $("#newsa" + TypeId + " textarea[name='description']").val();
	var id = this.currentTbAccountType;
	accountTypeId = this.currentTbAccountType;
	if ($("#newsa" + TypeId + " input[id='bank']").length > 0) {
		bankId = $("#newsa" + TypeId + " input[id='bank']").val();
	} else {
		bankId = "";
	}

	if ($("#newsa" + TypeId + " input[id='during']").length > 0) {
		days = $("#newsa" + TypeId + " input[id='during']").val();
	} else {
		days = "";
	}

	if ($("#newsa" + TypeId + " input[name='sdate']").length > 0) {
		enddate = $("#newsa" + TypeId + " input[name='sdate']").val();
	} else {
		enddate = "";
	}

    if ($("#newsa" + TypeId + " input[name='subName']").length > 0) {
		subName = $("#newsa" + TypeId + " input[name='subName']").val();
	} else {
		subName = "";
	} 
	
	//赋值结束，开始业务逻辑处理
	if (TypeId > 100) {
		//编辑子账户
		//editAccountSub(id, openbalance, balance, days, enddate, tbAccountType_id, subName, myTid);
	} else {
		//编辑主账户
		editAccount(accountId, TypeId, name, bankId, content);
	}
}

/**编辑账户提醒事件
*/
function editEvent(TypeId){
    var AccountId = $("#newsa" + TypeId + "_form input[name='AccountId']").val(),
        oldName = $("#tAT" + TypeId + " tr[accountid='" + AccountId + "'][subaccountid = 0]").attr("accountname"),
	    oldSubName = $("#tAT" + TypeId + " tr[accountid='" + AccountId + "']").next().attr("accountname"),
		enddate = $("#newsa" + TypeId + " input[name='sdate']").length > 0 ? $("#newsa" + TypeId + " input[name='sdate']").val() : "",
        alarm = $("#newsa" + TypeId + " span[id='rmday']").text(),
		newName = $("#newsa" + TypeId + " input[name='AccountName']").length > 0 ? $("#newsa" + TypeId + " input[name='AccountName']").val() : "",
		newSubName = $("#newsa" + TypeId + " input[name='subName']").length > 0 ? $("#newsa" + TypeId + " input[name='subName']").val() : "";
	if (TypeId == 101 || TypeId == 102){
	   var SubAccountId = $("#newsa3_form input[name='SubAccountId']").val();
	   oldName = $("#tAT3" + " tr[accountid='" + AccountId + "'][subaccountid = 0]").attr("accountname"),
	   oldSubName = $("#tAT3" + " tr[accountid='" + AccountId + "'][subaccountid = '"+ SubAccountId +"']").attr("accountname"),
	   newName = oldName;
	   if ($("#newsa" + TypeId + " .sCheckBox").hasClass("sCheckBox2") == true && enddate != ""){
		   updateEvent(oldName, oldSubName, enddate, alarm, newName, newSubName);
		}
	} else if (TypeId == 2){
	   var date = new Date();
	   var year = date.getFullYear(),
	       month = (date.getMonth() + 1 >= 10) ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
	   newSubName = oldSubName; 
	   if ($("#zddate").hasClass("sCheckBox2") == true && $("#billdate").val() != ""){ 
	       alarm = $("#endDay-zd span[id='rmday']").text();
		   enddate = $("#newsa" + TypeId + " input[name='billdate']").val();
		   var enddate_ = (enddate >= 10) ? enddate : "0" + enddate,
	           billdate = year + "-" + month + "-" + enddate_;//账单日
	       updateEvent(oldName, oldSubName + "账单日\t", billdate, alarm, newName, newSubName + "账单日\t");
		}
	   if ($("#zhkdate").hasClass("sCheckBox2") == true && $("#returndate").val() != ""){
	       alarm = $("#endDay-zhk span[id='rmday']").text();
		   enddate = $("#newsa" + TypeId + " input[name='returndate']").val();
		   var enddate_ = (enddate >= 10) ? enddate : "0" + enddate,
		       returndate = year  + "-" + month + "-" + enddate_;//还款日
           updateEvent(oldName, oldSubName + "还款日\t\t", returndate, alarm, newName, newSubName + "还款日\t\t");
		}
	} else if (TypeId == 3){
	       newSubname = oldSubName;
	       updateEvent(oldName, oldSubName, "", "", newName, newSubName);
	} else if (TypeId == 8){
	   oldSubName = "", newSubName ="";
	   if ($("#newsa" + TypeId + " .sCheckBox").hasClass("sCheckBox2") == true && enddate != ""){
	       name = $("#newsa" + TypeId + " input[name='AccountName']").val();
	       updateEvent(oldName, oldSubName, enddate, alarm, newName, newSubName);
	    }
	}
}

/**根据账户名和子账户名更新事件
*/
function updateEvent(oldName, oldSubName, enddate, alarm, newName, newSubName){
   if (enddate != "" && alarm != ""){
		var eventDescription = (oldName + " " + oldSubName + "到期").replace(/^\s+(.*?)\s+$/, "$1"); 
		var eventId = getEventIdByName(eventDescription);
		if (eventId != null){
			addInvestEvent(newName, newSubName, enddate, alarm, eventId);
		}
   }else {
        var eventDescription = (oldName + " " + oldSubName + "到期").replace(/^\s+(.*?)\s+$/, "$1");
        var newEventDescription = (newName + " " + newSubName + "到期").replace(/^\s+(.*?)\s+$/, "$1");		
		var eventId = getEventIdByName(eventDescription);
		try {
		    window.external.ExecuteSQL("update tbEvent set description = " + newEventDescription + "where id = " + eventId);
		}catch(e){
	        //TODO	
		}
   }
}

/** 显示弹出对话框
 * @param dialogName 对话框ID
 * @param NCB 是否改变按钮
 * @param    
 */
function showAdd(dialogName, NCB) {
	//首先处理底部按钮事件
	if (NCB == undefined) {
		changeButton(dialogName);
	}
	if ($("#" + dialogName).attr("level") == 2) {
		$("#scover1").show();
		$("#" + dialogName).parent().css("z-index", 300);
	} else {
		$("#scover").show();
	}
	$("#" + dialogName).parent().show();

	//清除所有验证信息
	$("#" + dialogName + " .dValidation .error").replaceWith("");

	//调整列表表格宽度
	$(".dRRBCenter").each(function (index) {
		$(this).width($(this).parent().parent().width() - 18);
	});
	
	//重定义回车事件
	$("#" + dialogName).unbind('keypress').keypress(function (event) {
		event.stopPropagation();
		if (event.keyCode == 13) {
			event.preventDefault();
			$("#" + dialogName).parents(".boxBg").find(".yes_btn").click();
		}
	});
	
	$("#" + dialogName + " .editArea").unbind('keypress').keypress(function (event) {
		event.stopPropagation();
		if (event.keyCode == 13) {
			event.preventDefault();
			$("#" + dialogName + " .editArea .bAdd").click();
		}
	});

	adjustWH(dialogName);
}

/** 调整弹出框高度和宽度
 * @param dialogName 弹出框名
 */
function adjustWH(dialogName) {
	if (($("#" + dialogName + " #addAccount_step2").is(":hidden")) || (!$("#" + dialogName + " #addAccount_step2").html())) {
		$("#" + dialogName).boxwidth($("#" + dialogName + " .dStep1").width() + 10);
		$("#" + dialogName).boxheight($("#" + dialogName + " .dStep1").height() + 10);
	} else {
		$("#" + dialogName).boxwidth($("#" + dialogName + " .dStep1").width() + $("#addAccount_step2").width() + 20);
		$("#" + dialogName).boxheight($("#" + dialogName + " #addAccount_step2").height() + 10);
	}
	$("#" + dialogName).parent().center();	
}

/** 关闭添加账户等对话框
 * @param dialogName 对话框ID
 * @param flag 标记是否要跳转至其它页面
 */
function cancelAdd(dialogName, flag) {
	if ($("#" + dialogName).attr("level") == 2) {
		$("#scover1").hide();
	} else {
		$("#scover").hide();
	}
	$("#" + dialogName).parent().hide();
	if (flag == undefined) {
		if (showAddCategory != "-1") {
			//从哪儿来的，回哪儿去
			window.open('index.html');
		}
		if (showAddPayee != "-1") {
			//从哪儿来的，回哪儿去
			window.open('index.html');
		}
	}
}

/** 获得元素
 * @param id 指定ID
 * @param tag 指定某元素下的标签
 */  
function Pid(id, tag){
	if (!tag) {
		return document.getElementById(id);
	} else {
		return document.getElementById(id).getElementsByTagName(tag);
	}
}

/** 切换标签
 * @param id 总容器
 * @param hx 标题栏头部的标签
 * @param box 标签自身的标签
 * @param iClass 标签的类别
 * @param s
 * @param pr
 */      
function tab_change(id, hx, box, iClass, s, pr){
	var hxs = Pid(id, hx);
	var boxs = Pid(id, box);

	if (!iClass) {
		// 如果不指定class，则：
		boxsClass = boxs; // 直接使用box作为容器
	} else {
		// 如果指定class，则：
		var boxsClass = [];
		for(i=0; i<boxs.length; i++){
			if (boxs[i].className.match(/\bdSetRight\b/)) {// 判断容器的class匹配
				boxsClass.push(boxs[i]);
			}
		}
	}
	if (!pr) {
		// 如果不指定预展开容器，则：
		go_to(0); // 默认展开序列
		yy();
	} else {
		go_to(pr);
		yy();
	}

	function yy() {
		for(var i=0; i<hxs.length; i++){
			hxs[i].temp = i;
			if (!s) {
				// 如果不指定事件，则：
				s = "onclick"; // 使用默认事件
				hxs[i][s] = function(){
					go_to(this.temp);
				}
			} else {
				hxs[i][s] = function(){
					go_to(this.temp);
				}
			}
		}
	}

	function go_to(pr){
		for(var i=0; i<hxs.length; i++) {
			if (!hxs[i].tmpClass) {
				hxs[i].tmpClass = hxs[i].className+=" ";
				boxsClass[i].tmpClass = boxsClass[i].className+=" ";
			}
			if (pr==i) {
				hxs[i].className += " up"; // 展开状态：标题
				boxsClass[i].className += " up"; // 展开状态：容器
			} else {
				hxs[i].className = hxs[i].tmpClass;
				boxsClass[i].className = boxsClass[i].tmpClass;
			}
		}
	}
}

/** 取得币种内容
 * @param id 币种编号
 */
function getCurrencyDesc(id) {
	var result = "";
	var list = getCurrencyInfo();//取得币种类型；

	$.each(list, function(i, n) {
		if (id == n.id) {
			result = n.Name;
		}
	});
	return result;
}

/** 入库前的字符串处理
 */
function replaceSQLStr(str) {
	if (str != undefined) {
		//sql保留字替换
		return str.replace(/\'/g,"\'\'");
	} else {
		return "";
	}
}

/** 已选定新建账户类型
 * @param TypeId 类型编号
 */
function NewAccountTypeSelected(TypeId) {
	$("#newaccount").parent().hide();
	AddSA(TypeId, 0, 0);
}

/** 显示html时先替换”&“
 */
function replaceHtmlStr(str) {
	//sql保留字替换
	return str.replace(/&/g,"&amp");
}

/** 生成空白行
 * @param tableId 表格名称
 * @param tdCount 列数
 * @return 生成的HTML代码
 */   
function generateEmptyLines(tableId, tdCount, clickEvent) {
	ELHTML = "";
	tableElement = $(tableId);
	$(tableId + " tr[mhcontent!='true']").remove();
	contentRows = $(tableId + " tr[mhcontent='true']").length;

	totalRows = (tableElement.closest("#dRRDetail").height() - 4) / 30;
	emptyRows = totalRows - contentRows;
	
	if (emptyRows > 0) {
		//需要显示空行
		if (contentRows % 2 == 0) currentClass = "tDetail1";
		else currentClass = "tDetail2";
	
		for (i=0; i<emptyRows; i++) {
			ELHTML += "<tr class='" + currentClass + "' onclick='" + clickEvent + "'>";
			for (j=0; j<tdCount; j++) {
				ELHTML += "<td>&nbsp;</td>";
			}
			ELHTML += "</tr>";
			if(currentClass == "tDetail1")
				currentClass = "tDetail2";
			else
				currentClass = "tDetail1";
		}
	}
	return ELHTML;
}

/** 生成日历事件
 * @param calDivId 日历控件编号
 * @param notNull 如果有值，则显示当前日期，否则显示一个空日历 
 */
function createSingleCalendar(calDivId, notNull) {
	try {
		$(function() {
			$.datepicker.setDefaults($.datepicker.regional["zh-CN"]);
			$(calDivId).datepicker();
			if (notNull != undefined) {
				$(calDivId).datepicker('setDate', new Date());
			}
			var showOn = $(calDivId).datepicker("option", "showOn");
			$("#ui-datepicker-div").click(function (event) {
				event.stopPropagation();
			});
		});
	}catch(e){
	}	
}
