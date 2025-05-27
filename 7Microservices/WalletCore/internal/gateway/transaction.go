package gateway

import "github.com/juliotinti/fullCycle_courses/internal/entity"

type TransactionGateway interface {
	Create(transaction *entity.Transaction) error
}
