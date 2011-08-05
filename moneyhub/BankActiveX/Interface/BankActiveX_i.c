

/* this ALWAYS GENERATED file contains the IIDs and CLSIDs */

/* link this file in with the server and any clients */


 /* File created by MIDL compiler version 7.00.0555 */
/* at Tue Aug 02 14:38:10 2011
 */
/* Compiler settings for .\Interface\BankActiveX.idl:
    Oicf, W1, Zp8, env=Win32 (32b run), target_arch=X86 7.00.0555 
    protocol : dce , ms_ext, c_ext, robust
    error checks: allocation ref bounds_check enum stub_data 
    VC __declspec() decoration level: 
         __declspec(uuid()), __declspec(selectany), __declspec(novtable)
         DECLSPEC_UUID(), MIDL_INTERFACE()
*/
/* @@MIDL_FILE_HEADING(  ) */

#pragma warning( disable: 4049 )  /* more than 64k source lines */


#ifdef __cplusplus
extern "C"{
#endif 


#include <rpc.h>
#include <rpcndr.h>

#ifdef _MIDL_USE_GUIDDEF_

#ifndef INITGUID
#define INITGUID
#include <guiddef.h>
#undef INITGUID
#else
#include <guiddef.h>
#endif

#define MIDL_DEFINE_GUID(type,name,l,w1,w2,b1,b2,b3,b4,b5,b6,b7,b8) \
        DEFINE_GUID(name,l,w1,w2,b1,b2,b3,b4,b5,b6,b7,b8)

#else // !_MIDL_USE_GUIDDEF_

#ifndef __IID_DEFINED__
#define __IID_DEFINED__

typedef struct _IID
{
    unsigned long x;
    unsigned short s1;
    unsigned short s2;
    unsigned char  c[8];
} IID;

#endif // __IID_DEFINED__

#ifndef CLSID_DEFINED
#define CLSID_DEFINED
typedef IID CLSID;
#endif // CLSID_DEFINED

#define MIDL_DEFINE_GUID(type,name,l,w1,w2,b1,b2,b3,b4,b5,b6,b7,b8) \
        const type name = {l,w1,w2,{b1,b2,b3,b4,b5,b6,b7,b8}}

#endif !_MIDL_USE_GUIDDEF_

MIDL_DEFINE_GUID(IID, IID_IBankCube,0x02B40C37,0xEEF0,0x4b9b,0xA1,0x97,0x0A,0x8F,0x7C,0x5A,0xA6,0xC8);


MIDL_DEFINE_GUID(IID, LIBID_BankCubeActiveXLib,0xF7FADB2E,0x53C8,0x47d2,0xAB,0xD6,0x7B,0x9A,0x2F,0xFE,0xD7,0x46);


MIDL_DEFINE_GUID(IID, DIID__IBankCubeEvents,0x76FFF751,0xE2FB,0x4cbc,0xB7,0xB0,0xB4,0x2C,0x37,0x0F,0x97,0xA4);


MIDL_DEFINE_GUID(CLSID, CLSID_BankCube,0x3A62635B,0x689F,0x40d6,0x81,0xAA,0x47,0x83,0x2F,0x84,0x3A,0x81);

#undef MIDL_DEFINE_GUID

#ifdef __cplusplus
}
#endif



