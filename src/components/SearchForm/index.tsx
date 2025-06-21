import { useState, useRef, useEffect, useMemo, ReactNode } from 'react'
import {
  Button,
  Select,
  TreeSelect,
  Form,
  Input,
  DatePicker,
  Cascader,
  Row,
  Col,
} from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { debounce, isBoolean } from 'lodash'

import upIcon from '@/assets/up-icon.png'
import downIcon from '@/assets/down-icon.png'
import { FormProps } from 'antd/es/form'
import classNames from 'classnames'
import './index.less'


export interface ItemProps {
  name: string
  label: string
  type?:
    | 'input'
    | 'select'
    | 'treeSelect'
    | 'multipleSelect'
    | 'rangePicker'
    | 'datePicker'
    | 'cascader'
    | 'shopNos'
    | 'permissionShopNos'
    | 'shopBusinessMode'
    | 'shopBusinessCode'
    | 'category'
    | 'materials'
    | 'materialStorageType'
    | 'region'
    | 'goods'
    | 'reportMaterialCategory'
  span?: number
  defaultValue?: any
  props?: Record<string, any>
  formItemProps?: Record<string, any>
  render?: () => ReactNode
}

export interface SearchFormProps extends Partial<HTMLDivElement> {
  id?: string
  formItems: ItemProps[]
  getFormData?: (val: any, isReset: boolean, form?: any) => void
  getFormCase?: (form: any) => void
  reRender?: any
  formProps?: FormProps
  defaultExpand?: boolean
}


const SearchForm = (props: SearchFormProps) => {
    const {
      id,
      formItems,
      getFormData,
      getFormCase,
      reRender = true,
      defaultExpand = true,
      formProps,
    } = props
    const [form] = formProps?.form ? [formProps.form] : Form.useForm()

    const span = 8
    const len = (24 / span) * 2
    const canExpand = useMemo(() => {
      return formItems?.length > len
    }, [formItems, len])
    const [idKey, setIdkey] = useState(
      id || `${Math.floor(Math.random() * 100000)}`,
    )
    const [isExpand, setIsExpand] = useState(canExpand ? defaultExpand : false)
    const isUnmountRef = useRef(false)


    const isHorizontal = useMemo(() => {
      return formItems.length <= 3
    }, [formItems])

    useEffect(() => {
      if (id) setIdkey(id)
    }, [id])

    useEffect(() => {
      if (getFormCase) getFormCase(form)
    }, [getFormCase])


    const getComponent = ({ type, name, props = {} }: ItemProps) => {
      switch (type) {
        case 'input':
          return <Input placeholder="请输入" allowClear {...props} />

        case 'select':
          return (
            <Select
              // getPopupContainer={(triggerNode) => triggerNode.parentElement}
              placeholder="请选择"
              showArrow
              allowClear
              filterOption={(inputValue, node: any) => {
                const { value, label } = node
                return (
                  `${label}`?.includes(inputValue) || `${value}` === inputValue
                )
              }}
              {...props}
            />
          )
        case 'treeSelect':
          return (
            <TreeSelect
              placeholder="请选择"
              allowClear
              filterTreeNode={(inputValue, treeNode) => {
                const { value, label } = treeNode
                return (
                  `${label}`?.includes(inputValue) || `${value}` === inputValue
                )
              }}
              {...props}
            />
          )

        case 'rangePicker':
          return <DatePicker.RangePicker {...props} />

        case 'datePicker':
          return <DatePicker {...props} />

        case 'cascader':
          return <Cascader style={{ width: '100%' }} {...props} />
    
        default:
          return null
      }
    }

    const setDefaultValue = () => {
      formItems
        .filter((it) => it.defaultValue !== undefined)
        .forEach(({ name, defaultValue }) => {
          form.setFieldsValue({
            [name]: defaultValue,
          })
        })
    }

    useEffect(() => {
      onReset(false, !!reRender)
    }, [reRender])

    useEffect(() => {
      return () => {
        isUnmountRef.current = true
      }
    }, [])

    const onSearch = debounce(async (isReset: boolean) => {
      try {
        // await form.validateFields()
        const values = form.getFieldsValue()
        if (!isUnmountRef.current) getFormData(values, isReset, form)
      } catch (err) {
        console.log('err', err)
      }
    }, 100)

    const onReset = debounce(
      async (isReset: boolean, isRequest: boolean = true) => {
        form.resetFields()
        setDefaultValue()
        if (isRequest) onSearch(isReset)
      },
      100,
    )

    return (
      <div className={props.className} style={props.style}>
        <div className="search-container">
          <div
            className={`search-form ${canExpand && !isExpand ? 'search-form-shrink' : ''}`}
          >
            <Form form={form} {...formProps}>
              <Row>
                {formItems.map((it, ix) => {
                  return (
                    <Col
                      className={`${canExpand && !isExpand && ix >= len - 1 ? 'search-form-item-hidden' : ''}`}
                      key={it.name}
                      span={span}
                    >
                      <Form.Item
                        label={it.label}
                        name={it.name}
                        // getValueFromEvent={
                        //   it.type === 'input' ? processInput : undefined
                        // }
                        {...(it.formItemProps || {})}
                      >
                        {it.type ? getComponent(it) : it.render?.()}
                      </Form.Item>
                    </Col>
                  )
                })}
                {canExpand ? (
                  <div
                    className="search-form-expand"
                    onClick={() => setIsExpand(!isExpand)}
                  >
                    {isExpand ? <span>收起更多</span> : <span>展开更多</span>}
                    <img alt="" src={isExpand ? upIcon : downIcon} />
                  </div>
                ) : null}
              </Row>
            </Form>
          </div>
          <div
            className={classNames(
              'search-btns',
              isHorizontal ? 'horizontal' : '',
            )}
          >
            <Button
              className="search"
              icon={<SearchOutlined />}
              type="primary"
              onClick={() => onSearch(false)}
            >
              查询
            </Button>
            <Button
              className="reset"
              icon={<ReloadOutlined />}
              onClick={() => onReset(true)}
            >
              重置
            </Button>
          </div>
        </div>
      </div>
    )
  }


export default SearchForm
