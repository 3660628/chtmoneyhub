//done
CREATE TABLE tbAccount(   //���˻���
  `id` BIGINT primary key NOT NULL DEFAULT 0 , //id������������
  `UT` BIGINT NOT NULL DEFAULT 0 ,  //������ʱ��
  `mark` INT(2) NOT NULL DEFAULT 0 , //���ɾ���ֶΣ�0������1ɾ��
  `Name` VARCHAR(256) NOT NULL ,  //�˻���
  `tbBank_id` BIGINT  NULL ,  //���������б��
  `tbAccountType_id` INTEGER  NOT NULL , //�������˻����ͱ��
  `AccountNumber` VARCHAR(256) NULL ,  //Ŀǰδʹ�� 
  `Comment` VARCHAR(256) NULL ,  //����
  `seq` INT(4) NOT NULL DEFAULT 0 ,  //����
  `EndDate` CHAR(4) NULL DEFAULT 0,  //���ÿ����͵����պͻ����յ����ͣ���4λ��ǰ��λ�����գ�����λΪ������
  `keyInfo` varchar(255) //�˻������Ŀ��ţ��˺�
)
		
CREATE TABLE tbAccountGetBillMonth( //��¼�˵�ץȡ�·�
  `id` BIGINT primary key NOT NULL DEFAULT 0 ,
  `UT` BIGINT NULL DEFAULT 0 ,
  `mark` INT(2) NULL DEFAULT 0 ,
  `tbmonth` VARCHAR(6) NULL DEFAULT NULL ,  //�˵�ץȡ��ʱ�䣬6λ��4λ�꣬2λ��
  `tbKeyInfo` VARCHAR(100) NULL DEFAULT NULL ,//����,�˺�
  `tbAccount_id` BIGINT NOT NULL  //�˺ŵ�id
)

CREATE TABLE tbAccountType(  //�˻����ͱ���100�Ժ��¼�˴�����˻�������
  `id` integer primary key NOT NULL,
  `Name` VARCHAR(256) NULL 
)

//done	
CREATE TABLE tbBank( //���ڻ�����
  `id` BIGINT primary key NOT NULL DEFAULT 0 ,
  `UT` BIGINT NOT NULL DEFAULT 0 ,
  `mark` INT(2) NOT NULL DEFAULT 0 ,
  `Name` VARCHAR(256) NOT NULL ,
  `classId` INTEGER NOT NULL, //���ڻ�������
  `BankID` VARCHAR(4) NULL ,  //���
  `Phone` VARCHAR(256) NULL , //�绰
  `Website` VARCHAR(256) NULL , //��ַ
  `seq` INT(4) NOT NULL DEFAULT 0 //����
)
	
//done 	2011-11-29 15:35
CREATE TABLE tbCategory1( //������
  `id` BIGINT primary key NOT NULL DEFAULT 0 ,
  `UT` BIGINT NOT NULL DEFAULT 0 ,
  `mark` INT(2) NOT NULL DEFAULT 0 ,
  `Name` VARCHAR(256) NULL,
  `Type` TINYINT NOT NULL, //���ͣ�0��Ϊ���룬1��Ϊ֧��
  `seq` INT(4) NOT NULL DEFAULT 0 //����
)

CREATE TABLE tbCategory2( //�ӷ���
  `id` BIGINT primary key NOT NULL DEFAULT 0 ,
  `UT` BIGINT NOT NULL DEFAULT 0 ,
  `mark` INT(2) NOT NULL DEFAULT 0 ,
  `Name` VARCHAR(256) NULL ,
  `tbCategory1_id` BIGINT NOT NULL ,//������id
  `seq` INT(4) NOT NULL DEFAULT 0 //����
)

CREATE TABLE tbCurrency( //���ֱ�
  `id` integer  primary key NOT NULL DEFAULT 0 ,
  `Name` VARCHAR(256) NOT NULL ,
  `seq` INT(4) NOT NULL DEFAULT 0 //����
)

CREATE TABLE tbDBInfo(schema_version INT) //���ݿ�汾

CREATE TABLE tbEvent(  //����ʱ���
  `id` BIGINT PRIMARY KEY NOT NULL DEFAULT 0 ,
  `UT` BIGINT NULL DEFAULT 0 ,
  `mark` INT(2) NULL DEFAULT 0 ,
  `event_date` INTEGER  NULL ,  //����ʱ��
  `description` CHAR(256) NULL ,  //��������
  `repeat` INTEGER  NULL ,  //����
  `alarm` INTEGER  NULL ,   //��ǰ��������
  `status` INTEGER  NULL ,  //�Ƿ�����
  `datestring` CHAR(12) NULL ,  //�������ڣ���ʽ���£�2011-01-01 1
  `tbAccount_id` BIGINT NULL ,  //���˻�id
  `tbSubAccount_id` BIGINT NULL , //���˻�id
  `type` INT(2) NULL  //��������
)
  
//done 
CREATE TABLE tbPayee(  //֧������
  `id` bigint  PRIMARY KEY NOT NULL DEFAULT 0 ,
  `UT` BIGINT NOT NULL DEFAULT 0 ,
  `mark` INT(2) NOT NULL DEFAULT 0 ,
  `Name` VARCHAR(256) NOT NULL ,
  `email` VARCHAR(256),
  `tel` VARCHAR(256),
  `seq` INT(4) NOT NULL DEFAULT 0 //���� 
)
  
  
CREATE TABLE tbProductChoice(
  `id` BIGINT PRIMARY KEY  NOT NULL DEFAULT 0 ,
  `UT` BIGINT NULL DEFAULT 0 ,
  `mark` INT(2) NULL DEFAULT 0 ,
  `interestchoice` VARCHAR(256) NULL DEFAULT NULL , //��¼���û����Ʋ�Ʒ�ı���
  `durationchoice` VARCHAR(256) NULL DEFAULT NULL , //��¼���û����Ʋ�Ʒ�ı���
  `currencychoice` VARCHAR(256) NULL DEFAULT NULL , //��¼���û����Ʋ�Ʒ�ı���                          
  `bankchoice` VARCHAR(256) NULL DEFAULT NULL , //��¼���û����Ʋ�Ʒ�ı���
  `userId` BIGINT NULL DEFAULT 0 //�˻�id 
)


//done
CREATE TABLE tbSubAccount(
  `id` BIGINT primary key NOT NULL DEFAULT 0 ,
  `UT` BIGINT NOT NULL DEFAULT 0 ,
  `mark` INT(2) NOT NULL DEFAULT 0 ,
  `tbAccount_id` BIGINT NOT NULL ,  //���˻�����
  `tbCurrency_id` BIGINT NOT NULL , //��������
  `name` VARCHAR(256) NOT NULL ,
  `OpenBalance` FLOAT NOT NULL ,  //�������
  `Balance` FLOAT NOT NULL ,    //��ǰ���
  `Days` INTEGER  NULL ,        //��������˻�������
  `EndDate` DATE NULL DEFAULT 0 ,  //��������˻��ĵ�����
  `Comment` VARCHAR(256) NULL ,  //����
  `tbAccountType_id` INTEGER  NULL , //������͵����˻����ͣ���Ӧtbaccounttpye����100�Ժ������
  `seq` INT(4) NOT NULL DEFAULT 0  //����
)
  
//done
//done 2011-11-29 15:34
CREATE TABLE tbTransaction(  //���ױ�
  `id` BIGINT primary key NOT NULL DEFAULT 0,
  `UT` BIGINT NOT NULL DEFAULT 0,
  `mark` INT(2) NOT NULL DEFAULT 0 ,
  `TransDate` DATE NOT NULL , //��������
  `tbPayee_id` BIGINT NULL ,  //���׶���
  `tbCategory2_id` BIGINT NULL , //���׷���
  `Amount` FLOAT NOT NULL DEFAULT 0 , //���׽��
  `direction` BIGINT NULL DEFAULT 0 , //ת��������ؼ�¼��id
  `tbSubAccount_id` BIGINT NOT NULL , //�������������˻�id
  `tbSubAccount_id1` BIGINT NULL , //ת��������ؼ�¼���������˻�id
  `ExchangeRate` FLOAT NULL ,  //���ʣ�δʹ��
  `Comment` VARCHAR(256) NULL , //����
  `sign` VARCHAR(256) NULL,  //��¼ץ�˵���¼ԭʼ����
  `transactionClasses` int(2),  //��ʶ���ͣ�0���ֹ��ʣ�1��Ϊϵͳ�ʣ����˵���
  `seq` INT(4) NOT NULL DEFAULT 0 //����
)
  




