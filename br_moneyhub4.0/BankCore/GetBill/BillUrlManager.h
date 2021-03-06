#pragma once
#include "../stdafx.h"
#include <map>
#include <list>
#include <string>
using namespace std;
#include "../../BankData/BankData.h"

enum BillState
{
	bSNormal,
	bSExceedTime,
	bSCancel
};
typedef struct urllist
{
	int type;//类型
	map<int, wstring> url;//关键步骤的url链表
	vector<int> m_beginstep;//记录起始步骤的开始 
}URLLIST, *LPURLLIST;

typedef struct BillUrlData
{
	string			id;			// 机构编号
	wstring			name;		// 机构名称
	wstring			dll;		// 动态库名称
	int             m_islogin;   //login
	int             m_mode;       //mode
	list<URLLIST>	urldata;
}BILLURLDATA;

// 导入账单记录部分
class CBillUrlManager
{
private:
	CBillUrlManager();
	~CBillUrlManager();

	static CBillUrlManager* m_Instance;
public:
	static CBillUrlManager* GetInstance();
	bool Init();

	// 存储导入账单所用的dll句柄
	HMODULE					m_urldll;

private:
	// 存储导入账单步骤中所用到的网址的数据
	list<BILLURLDATA>		m_billlist;
	// 读取导入账单网址数据文件
	std::string GetFileContent(wstring strPath,bool bCHK);

	// 存储和导入账单相关联的线程和数据，保证由导入账单父线程创建的子线程也能找到要导入账单传入参数的相关数据
	map<DWORD, BillData*>	m_billTid;

	BILLRECORDS			m_BillRecords;	//账单记录的指针，需要保证多线程使用时按顺序执行插入该数据

	CRITICAL_SECTION		m_cs; // 临界区,暂时没用
public:	
	// 根据机构aid和账单类型获得其所对应的url和关键步骤的数据对应关系
	LPBILLRECORDS GetBillRecords()
	{
		return &m_BillRecords;
	}
	LPURLLIST  GetUrlMap(string aid, int type);
	wstring GetBillUrl(string aid, int type, int step, bool& isBeginStep);

	bool InsertBillTid(DWORD pid, BillData* pData);
	BillData* GetBillTid(DWORD pid);
public:
	void ShowResultDlg();
	wstring GetDllName(string aid);
	int  Getislogin(string aid);
	int  Getmode(string aid);
	bool DeleteBillTid(DWORD pid);
	void FreeDll();
	//CComVariant CallJScript(IHTMLDocument2 *doc, std::string strFunc,std::vector<std::string>& paramVec);
	//CComVariant CallJScript2(IHTMLDocument2 *doc, std::string strFunc, DISPPARAMS& dispparams);
	// 将账单数据写入数据库的接口
	void SendBillRecordToJS(BillData* pData);
public:
	// 调用dll处理网页内容和步骤数据的接口
	int GetBill(IWebBrowser2* pFatherWebBrowser, IWebBrowser2* pChildWebBrowser, BillData* pData, int& step, HWND hAxControl = NULL);

	void SetGetBillState(BillState bState);
	void SetNotifyWnd(HWND notifyWnd);
	void InitDll();
	void FilterXml(char* pString, int maxlength = 256);
};