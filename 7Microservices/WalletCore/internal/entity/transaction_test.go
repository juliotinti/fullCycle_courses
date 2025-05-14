package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateTransaction(t *testing.T) {
	client1, _ := NewClient("john doe", "j@j")
	client2, _ := NewClient("jane doe", "j@j")
	account1 := NewAccount(client1)
	account2 := NewAccount(client2)

	account1.Credit(100)
	account2.Credit(50)

	transaction, err := NewTransaction(account1, account2, 50)
	assert.Nil(t, err)
	assert.NotNil(t, transaction)
	assert.Equal(t, 50.0, account1.Balance)
	assert.Equal(t, 100.0, account2.Balance)
}

func TestCreateTransactionWithInsufficientFunds(t *testing.T) {
	client1, _ := NewClient("john doe", "j@j")
	client2, _ := NewClient("jane doe", "j@j")
	account1 := NewAccount(client1)
	account2 := NewAccount(client2)

	account1.Credit(100)
	account2.Credit(50)

	transaction, err := NewTransaction(account1, account2, 150)
	assert.NotNil(t, err)
	assert.Error(t, err, "insufficient funds")
	assert.Nil(t, transaction)
	assert.Equal(t, 100.0, account1.Balance)
	assert.Equal(t, 50.0, account2.Balance)
}
