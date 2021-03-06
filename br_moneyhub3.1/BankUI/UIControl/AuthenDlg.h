#pragma once

#include "AltSkinClasses.h"
#include "..\BankData\BankData.h"
#include "CoolMessageBox.h"

class CAuthenDlg : public CDialogImpl<CAuthenDlg>, public CDialogSkinMixer<CAuthenDlg>
{
public:
	CAuthenDlg() : m_bOK(false)
	{
	}

public:
	enum { IDD = IDD_DIALOG_AUTHEN };

	BEGIN_MSG_MAP(CAuthenDlg)
		CHAIN_MSG_MAP(CDialogSkinMixer<CAuthenDlg>)
		MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
		MESSAGE_HANDLER(WM_TIMER, OnTimer)
		MESSAGE_HANDLER(WM_PAINT, OnPaint)
		COMMAND_ID_HANDLER(IDOK, OnOK)
		COMMAND_ID_HANDLER(IDCANCEL, OnCancel)
		COMMAND_ID_HANDLER(IDC_PWD_LOST, OnPwdLost)
		COMMAND_ID_HANDLER(IDC_SYSCLOSE, OnCancel)
		REFLECT_NOTIFICATIONS()
	END_MSG_MAP()

// Handler prototypes (uncomment arguments if needed):
//	LRESULT MessageHandler(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/)
//	LRESULT CommandHandler(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
//	LRESULT NotifyHandler(int /*idCtrl*/, LPNMHDR /*pnmh*/, BOOL& /*bHandled*/)

	LRESULT OnInitDialog(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/)
	{
		CenterWindow(GetParent());
		SetWindowText(_T("财金汇密码"));

		ApplyButtonSkin(IDOK);
		ApplyButtonSkin(IDCANCEL);
		ApplyButtonSkin(IDC_PWD_LOST);

		::SendMessage(GetDlgItem(IDC_EDIT_PWD), EM_LIMITTEXT, 20, 0L);
		::SendMessage(GetDlgItem(IDC_EDIT_PWD), EM_SETPASSWORDCHAR, '*', 0L);  

		if (m_nWaitMS > 0)
		{
			::EnableWindow(GetDlgItem(IDOK), FALSE);
			SetDlgItemInt(IDOK, m_nWaitMS);
			SetTimer(0x1, 1000, NULL);
		}
		
		return TRUE;
	}

	LRESULT OnTimer(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/)
	{
		if (--m_nWaitMS != 0)
		{
			SetDlgItemInt(IDOK, m_nWaitMS);
		}
		else
		{
			KillTimer(0x1);
			SetDlgItemText(IDOK, _T("确定"));
			::EnableWindow(GetDlgItem(IDOK), TRUE);
		}

		return 0;
	}

	LRESULT OnPaint(UINT /*uMsg*/, WPARAM wParam, LPARAM /*lParam*/, BOOL& /*bHandled*/)
	{
		CPaintDC dc(m_hWnd);

		CRect rcText(20, 44, 300, 500);
		dc.SetTextColor(m_crTextColor);
		dc.SelectFont(m_fontText);
		dc.DrawText(_T("请输入密码:"), -1, &rcText, 0);

		return 0;
	}

	LRESULT OnOK(WORD /*wNotifyCode*/, WORD wID, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
	{
		CString strPassword;
		GetDlgItemText(IDC_EDIT_PWD, strPassword);

		CBankData* pBankData = CBankData::GetInstance();
		std::string strPwd = pBankData->GetPwd();

		USES_CONVERSION;
		if (strPassword.Compare(A2CT(strPwd.c_str())) == 0)
			m_bOK = TRUE;
		else
			m_bOK = FALSE;

		EndDialog(IDOK);

		return 0;
	}

	LRESULT OnCancel(WORD /*wNotifyCode*/, WORD wID, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
	{
		EndDialog(IDCANCEL);

		return 0;
	}

	LRESULT OnPwdLost(WORD /*wNotifyCode*/, WORD wID, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
	{
		CString strTitle = _T("忘记密码");
		CString strQuestion = _T("是否强制清除密码？如果您强制清除密码，所有保存的收藏、事件提醒也将被清除！");
		if (IDNO == mhMessageBox(GetActiveWindow(), (LPCTSTR)strQuestion, (LPCTSTR)strTitle, MB_YESNO | MB_ICONQUESTION))
			return 0;
		else
		{
			strQuestion = _T("您保存的收藏、事件提醒和密码将被全部被清除，请确认！");
			if (IDNO == mhMessageBox(GetActiveWindow(), (LPCTSTR)strQuestion, (LPCTSTR)strTitle, MB_YESNO | MB_ICONQUESTION))
				return 0;
			else
			{
				CBankData* pBankData = CBankData::GetInstance();
				pBankData->RemoveDatabase();

				m_bOK = TRUE;
				EndDialog(IDOK);

				return 0;
			}
		}
	}

protected:
	BOOL m_bOK;
	UINT m_nWaitMS;

public:
	static BOOL AuthenEnabled()
	{
		CBankData* pBankData = CBankData::GetInstance();
		std::string strPwd = pBankData->GetPwd();
		return !strPwd.empty();
	}

	static BOOL Authenticate()
	{
		CAuthenDlg dlg;
		
		for (int i = 0; true; i++)
		{
			if (i < 3)
				dlg.m_nWaitMS = 0;
			else if (i < 9)
				dlg.m_nWaitMS = (i - 2) * 10;
			else
				dlg.m_nWaitMS = 60;

			if (IDCANCEL == dlg.DoModal())
				return FALSE;

			if (dlg.m_bOK)
				break;
		}

		return TRUE;	
	}

};
