---
title: "실시간 이벤트 스트리밍 분석 (Kafka + Streaming)"
summary: "실시간 KPI·탐지·알림 파이프라인 구축. 정확도 vs 지연(latency) 트레이드오프, 재처리(replay), 스키마·중복 처리를 설계·구현한 End-to-End 스트리밍 데이터 엔지니어링 프로젝트입니다."
role: "Data Engineer"
timeline: "6~8주"
featured: true
order: 1
stack:
  - "Apache Kafka"
  - "Apache Flink"
  - "ClickHouse"
  - "Grafana"
  - "Docker / Docker Compose"
  - "Python (Producer / Dispatcher)"
impact:
  - "Streaming DE 및 분산 시스템 아키텍처 이해도 증명"
  - "운영 관점(컨슈머 lag, 백프레셔) 모니터링 및 Exactly-once 시맨틱스 적용"
  - "실시간 집계(분 단위 윈도우) 및 지표 이상치 감지·Discord 알림 연동"
  - "Dead-letter 큐 및 재처리 파이프라인으로 데이터 유실·중복 대응"
links:
  repo: "https://github.com/YoongeonChoi/-Kafka-Streaming-"
---

## Problem

한국 주요 기업의 데이터 엔지니어 채용 공고에는 **Kafka, Flink, Spark 기반 스트리밍 파이프라인** 경험이 반복적으로 등장합니다. 단순 배치 ETL을 넘어, **실시간 KPI·이상 탐지·알림**까지 책임지는 역량을 보여줄 필요가 있었고, 이를 위해 “정확도 vs 지연”, “재처리(replay)”, “스키마·중복 처리”를 직접 설계·구현한 프로젝트가 필요했습니다.

목표는 **대규모 트래픽 환경을 가정한 클릭스트림·주문 이벤트를 실시간으로 수집 → 정제 → 집계 → 시각화·알림**까지 이어지는 End-to-End 파이프라인을 구축하고, Exactly-Once 처리와 DLQ(Dead-Letter Queue) 기반 재처리까지 포함해, 실제 JD에서 요구하는 스트리밍 DE 역량을 포트폴리오로 정리하는 것이었습니다.

## Approach

### 아키텍처 및 데이터 흐름

파이프라인은 **Producer → Kafka → Flink → Kafka(집계/알림/DLQ) → ClickHouse → Grafana·Dispatcher** 순으로 구성했습니다.

1. **이벤트 생성 (Producer)**  
   Python으로 가상의 클릭스트림·주문 이벤트를 생성해 Kafka Raw 토픽에 전송합니다.

2. **버퍼링 (Kafka)**  
   Kafka가 이벤트를 임시 저장하고, 분산 브로커 환경에서 스트림 큐를 유지합니다.

3. **스트림 처리 (Flink)**  
   Flink JobManager/TaskManager가 Kafka에서 데이터를 소비해 **파싱·유효성 검사**, **워터마크 기반 지연 도착(Late Data) 처리**, **1분 단위 Tumbling Window 집계**를 수행하고, 결과를 Kafka의 집계·알림·DLQ 토픽으로 Exactly-Once로 전송합니다.

4. **OLAP 적재 (ClickHouse)**  
   ClickHouse Kafka Engine으로 집계 토픽을 소비하고, Materialized View를 통해 AggregatingMergeTree 기반 조회용 테이블에 적재합니다.

5. **시각화·알림**  
   Grafana에서 실시간 메트릭 대시보드를 구성하고, Python Dispatcher가 DLQ 스파이크·매출 오류 등 이벤트를 감지해 Discord 웹훅으로 알림을 보냅니다.

### 핵심 기능 구현

**이벤트 스키마(버전) 관리**  
이벤트 포맷을 명확히 하고, 파싱 실패·스키마 불일치 시 Side-Output으로 DLQ 토픽(`events.dlq.v1`)에 분기해 추후 재처리·디버깅이 가능하도록 했습니다.

**실시간 집계 (분 단위)**  
Flink에서 `WatermarkStrategy`와 **Allowed Lateness**를 설정해, 허용 범위 내 지연 데이터는 기존 1분 윈도우를 갱신(Upsert)하고, 초과분은 DLQ로 보냅니다. 집계 결과는 Kafka를 거쳐 ClickHouse에 적재됩니다.

**지표 이상치 감지 및 알림**  
집계 결과·DLQ 발생량을 Dispatcher가 구독하고, 임계치 초과 시 Discord로 실시간 웹훅 알림을 보내 비즈니스·운영 대응이 가능하도록 했습니다.

**Dead-letter 및 재처리 파이프라인**  
파싱 에러·지나치게 지연된 데이터는 버리지 않고 DLQ 토픽으로 보관해, 재처리(replay) 시 동일 파이프라인으로 다시 주입할 수 있게 설계했습니다.

### 기술 스택 선택 이유

- **Kafka**: 스트리밍 표준 메시지 브로커로, 디커플링·재처리·확장성 확보.
- **Flink**: 체크포인트·트랜잭션 기반 Exactly-Once, 윈도우·워터마크 지원으로 정확도와 지연 트레이드오프 제어.
- **ClickHouse**: 실시간 집계·OLAP 쿼리에 유리한 컬럼형 저장소로, Kafka Engine으로 토픽 직접 소비.
- **Grafana**: ClickHouse 데이터소스 연동으로 실시간 대시보드 제공.

## Trade-offs

### 정확도 vs 지연 (Latency)

- **워터마크·Allowed Lateness**로 “얼마나 늦은 데이터까지 반영할지”를 설정해, 지연 도착 이벤트를 포함한 정확한 집계와 낮은 지연 사이의 균형을 조정할 수 있게 했습니다.
- 허용 범위를 넘는 데이터는 DLQ로 보내 정합성을 해치지 않으면서, 재처리로 나중에 반영할 수 있습니다.

### Exactly-Once 및 정합성

- Flink **체크포인트**와 Kafka **트랜잭션 API**를 사용해, 한 체크포인트 주기가 끝난 뒤에만 Kafka에 커밋되도록 했습니다. 이를 통해 장애 시에도 **중복·유실 없이** 한 번만 처리되는 시맨틱스를 목표로 설계했습니다.

### 운영 관점

- Flink Dashboard에서 **백프레셔·체크포인트 상태**를 확인하고, Kafka UI에서 **토픽·컨슈머 lag**를 모니터링할 수 있도록 Docker Compose 기반으로 한 번에 기동되는 환경을 구성했습니다. 실제 JD에서 요구하는 “컨슈머 lag/백프레셔” 슈팅 경험을 이 프로젝트로 설명할 수 있습니다.

## Outcome

- **실시간 E2E 파이프라인**을 Docker Compose로 기동해, Producer → Kafka → Flink → ClickHouse → Grafana·Discord 알림까지 한 번에 검증 가능한 구조를 만들었습니다.
- **Exactly-Once 시맨틱스**, **DLQ·재처리**, **워터마크·Late Data 처리**를 코드와 아키텍처 수준에서 적용해, “정확도 vs 지연”, “재처리”, “스키마·중복 처리”를 면접에서 구체적으로 설명할 수 있는 포인트를 확보했습니다.
- 확장 옵션으로 **CDC(Debezium) 연결**, **Iceberg/Trino 기반 레이크하우스 적재**, **Idempotency 전략**을 문서화해 두었으며, 추후 동일 스택으로 확장할 수 있도록 설계했습니다.

프로젝트 저장소는 [GitHub - YoongeonChoi/-Kafka-Streaming-](https://github.com/YoongeonChoi/-Kafka-Streaming-)에서 확인할 수 있으며, `run.ps1`(Windows) 또는 Makefile(Linux/Mac)으로 전체 파이프라인을 실행할 수 있습니다.
