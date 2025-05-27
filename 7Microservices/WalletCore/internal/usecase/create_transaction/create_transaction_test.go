package createtransaction

import (
	"testing"

	"github.com/juliotinti/fullCycle_courses/internal/entity"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type TransactionGatewayMock struct {
	mock.Mock
}

func (m *TransactionGatewayMock) Create(transaction *entity.Transaction) error {
	args := m.Called(transaction)
	return args.Error(0)
}

type AccountGatewayMock struct {
	mock.Mock
}

func (a *AccountGatewayMock) Save(account *entity.Account) error {
	args := a.Called(account)
	return args.Error(0)
}

func (a *AccountGatewayMock) FindByID(id string) (*entity.Account, error) {
	args := a.Called(id)
	return args.Get(0).(*entity.Account), args.Error(1)
}

func TestCreateTransactionseCase_Execute(t *testing.T) {
	client1, _ := entity.NewClient("John Doe", "j@j.com")
	account1 := entity.NewAccount(client1)
	account1.Credit(100)

	client2, _ := entity.NewClient("John Doe", "j2@j.com")
	account2 := entity.NewAccount(client2)
	account2.Credit(100)

	mockAccountGateway := &AccountGatewayMock{}
	mockAccountGateway.On("FindByID", account1.ID).Return(account1, nil)
	mockAccountGateway.On("FindByID", account2.ID).Return(account2, nil)

	mockTransactionGateway := &TransactionGatewayMock{}
	mockTransactionGateway.On("Create", mock.Anything).Return(nil)

	inputDto := CreateTransactionInputDTO{
		AccountIDFrom: account1.ID,
		AccountIDFTo:  account2.ID,
		Amount:        10,
	}

	useCase := NewCreateTransactionUseCase(mockTransactionGateway, mockAccountGateway)
	output, err := useCase.Execute(inputDto)
	assert.Nil(t, err)
	assert.NotNil(t, output)
	mockAccountGateway.AssertExpectations(t)
	mockTransactionGateway.AssertExpectations(t)
	mockAccountGateway.AssertNumberOfCalls(t, "FindByID", 2)
	mockTransactionGateway.AssertNumberOfCalls(t, "Create", 1)
}
